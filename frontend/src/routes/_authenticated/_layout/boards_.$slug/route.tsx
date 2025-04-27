import { Columns } from "@/features/board-detail/columns";
import { createFileRoute, linkOptions } from "@tanstack/react-router";
import { ModalProvider } from "@/state/modals";
import { CreateColumnButton } from "@/features/board-detail/create-column-button";
import { useQuery } from "@rocicorp/zero/react";
import { getBoardWithColumnsAndTasksQuery } from "@/lib/zero-queries";
import { useZ } from "@/lib/zero-cache";
import { TaskDetailPage } from "./-actions";
import { EditableText } from "@/components/editable-text";
import { OtherActions } from "@/features/board-detail/other-actions";

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
    return null;
  }

  const handleBoardNameChange = (updatedName: string) => {
    z.mutate.boardsTable.update({
      id: board.id,
      name: updatedName,
    });
  };

  return (
    <ModalProvider>
      <div className="pt-4 flex-1 h-full min-h-0 flex flex-col gap-8">
        <div className="flex gap-5 items-center shrink-0 px-8 w-fit">
          <EditableText
            inputLabel="Edit board name"
            fieldName="boardName"
            buttonClassName="text-2xl font-bold w-fit py-1.5!"
            inputClassName="text-2xl font-bold w-56 py-1.5!"
            defaultValue={board.name}
            onSubmit={handleBoardNameChange}
          />
          <div className="flex gap-3">
            <CreateColumnButton />
            <OtherActions board={board} />
          </div>
        </div>

        <div className="flex-1 h-full min-h-0">
          <Columns boardId={board.id} columns={board.columns} />
        </div>
      </div>
      <TaskDetailPage />
    </ModalProvider>
  );
}
