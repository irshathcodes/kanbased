"use client";
import { Columns } from "@/features/board-detail/components/columns";

import { createFileRoute, linkOptions } from "@tanstack/react-router";
import { queryClient } from "@/lib/query-client";
import { columnsQueryOptions as getColumnsQueryOptions } from "@/lib/query-options-factory";
import { ModalProvider } from "@/state/modals";
import { CreateColumnButton } from "@/features/board-detail/components/create-column-button";
import { useColumnsSuspenseQuery } from "@/features/board-detail/queries/columns";
import { TaskDetailPage } from "./-actions";
import { getActiveOrganizationId } from "@/queries/session";

export const Route = createFileRoute(
  "/_authenticated/_layout/boards_/$slug",
)({
  component: BoardPage,
  validateSearch: (search): { taskId?: string } => {
    return {
      taskId: typeof search.taskId === "string" ? search.taskId : undefined,
    };
  },
  loader: async (ctx) => {
    const { boardUrl } = ctx.params;
    const orgId = getActiveOrganizationId(queryClient);
    const columnsQueryOptions = getColumnsQueryOptions({ orgId, boardUrl });

    await queryClient.prefetchQuery(columnsQueryOptions);

    const { boardName } =
      await queryClient.ensureQueryData(columnsQueryOptions);

    return {
      breadcrumbs: linkOptions([
        {
          label: "Boards",
          to: "/boards",
        },
        {
          label: boardName,
          to: "/boards/$boardUrl",
          params: { boardUrl },
        },
      ]),
      columnsQueryOptions,
    };
  },
  errorComponent: (error) => {
    return <ErrorComponent message={error.error?.message} />;
  },
});

function BoardPage() {
  const { boardUrl } = Route.useParams();
  const { data, error } = useColumnsSuspenseQuery({ boardUrl });
  const boardName = data.boardName;
  const { columnsQueryOptions } = Route.useLoaderData();
  const columnsQueryKey = columnsQueryOptions.queryKey;

  // Not sure why. The error component is not being rendered when there is an error.
  // Hence, we are checking the error status code manually.
  if (error) {
    return <ErrorComponent message={error?.message} />;
  }

  return (
    <ModalProvider>
      <div className="pt-4 flex-1 h-full min-h-0 flex flex-col gap-8">
        <div className="flex gap-5 items-center shrink-0 px-8">
          <h1 className="text-2xl font-bold">{boardName}</h1>
          <CreateColumnButton />
        </div>

        <div className="flex-1 h-full min-h-0">
          <Columns boardUrl={boardUrl} columnsQueryKey={columnsQueryKey} />
        </div>
      </div>
      <TaskDetailPage columnsQueryKey={columnsQueryKey} />
    </ModalProvider>
  );
}

function ErrorComponent({ message }: { message?: string }) {
  return (
    <p className="text-center text-destructive-foreground">
      {message || "An error occurred"}
    </p>
  );
}
