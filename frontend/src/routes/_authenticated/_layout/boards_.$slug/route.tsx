"use client";
import { Columns } from "@/features/board-detail/columns";

import { createFileRoute, linkOptions } from "@tanstack/react-router";
import { ModalProvider } from "@/state/modals";
import { CreateColumnButton } from "@/features/board-detail/create-column-button";
import { useQuery } from "@rocicorp/zero/react";
import { getBoardWithColumnsAndTasksQuery } from "@/lib/zero-queries";
import { useZ } from "@/lib/zero-cache";
import { TaskDetailPage } from "./-actions";

export const Route = createFileRoute("/_authenticated/_layout/boards_/$slug")({
  component: BoardPage,
  validateSearch: (search): { taskId?: string } => {
    return {
      taskId: typeof search.taskId === "string" ? search.taskId : undefined,
    };
  },
  loader: async (ctx) => {
    return {
      breadcrumbs: linkOptions([
        {
          label: "Boards",
          to: "/boards",
        },
        {
          // TODO: Use the board name instead of the slug
          label: ctx.params.slug,
          to: "/boards/$slug",
          params: { slug: ctx.params.slug },
        },
      ]),
    };
  },
});

function BoardPage() {
  const { slug } = Route.useParams();
  const z = useZ();
  const [board] = useQuery(getBoardWithColumnsAndTasksQuery(z, slug));

  if (!board) {
    // TODO: Show a loading state or figure out a better way to handle this
    return null;
  }

  return (
    <ModalProvider>
      <div className="pt-4 flex-1 h-full min-h-0 flex flex-col gap-8">
        <div className="flex gap-5 items-center shrink-0 px-8">
          <h1 className="text-2xl font-bold">{board.name}</h1>
          <CreateColumnButton />
        </div>

        <div className="flex-1 h-full min-h-0">
          <Columns boardId={board.id} columns={board.columns} />
        </div>
      </div>
      <TaskDetailPage />
    </ModalProvider>
  );
}
