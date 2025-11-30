import {createFileRoute, linkOptions, useRouter} from "@tanstack/react-router";
import {useQuery} from "@rocicorp/zero/react";
import {Columns} from "@/features/board-detail/columns";
import {ModalProvider} from "@/state/modals";
import {CreateColumnButton} from "@/features/board-detail/create-column-button";
import {getBoardWithColumnsAndTasksQuery} from "@/lib/zero-queries";
import {useZ} from "@/lib/zero-cache";
import {EditableText} from "@/components/editable-text";
import {OtherActions} from "@/features/board-detail/other-actions";
import {useAuthData} from "@/queries/session";
import {UndoManagerProvider} from "@/state/undo-manager";
import {TaskDetail} from "@/features/board-detail/task-detail";

export const Route = createFileRoute(
  "/_authenticated/_layout/boards_/$boardId",
)({
  component: BoardPage,
  validateSearch: (search): {taskId?: string} => {
    return {
      taskId: typeof search.taskId === "string" ? search.taskId : undefined,
    };
  },

  context: () => {
    let _boardName = "";
    return {
      getBoardName: () => _boardName,
      setBoardName: (name: string) => {
        _boardName = name;
      },
    };
  },

  loader: (ctx) => {
    return {
      breadcrumbs: linkOptions([
        {
          label: "Boards",
          to: "/boards",
        },
        {
          label: ctx.context.getBoardName(),
          to: "/boards/$boardId",
          params: {boardId: ctx.params.boardId},
        },
      ]),
    };
  },
  head(ctx) {
    const boardName: string = ctx.match.context.getBoardName();

    return {
      meta: [{title: boardName}],
    };
  },
});

function BoardPage() {
  const {boardId} = Route.useParams();
  const z = useZ();
  const userData = useAuthData();
  const isMember = userData.role === "member";
  const [board] = useQuery(getBoardWithColumnsAndTasksQuery(z, boardId));
  const router = useRouter();
  const routeCtx = Route.useRouteContext();
  const {taskId} = Route.useSearch();

  if (board?.name && routeCtx.getBoardName() !== board.name) {
    routeCtx.setBoardName(board.name);
    router.invalidate();
  }

  if (!board) {
    return null;
  }

  const handleBoardNameChange = (updatedName: string) => {
    z.mutate.boardsTable.update({
      id: board.id,
      name: updatedName,
    });
  };

  const handleClose = () => {
    router.navigate({
      to: ".",
      search: {taskId: undefined},
      replace: true,
    });

    setTimeout(() => {
      const el = document.querySelector(`#task-${taskId}`);
      if (el) {
        (el as HTMLElement).focus();
      }
    }, 100);
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
          {!isMember && (
            <div className="flex gap-2">
              <CreateColumnButton />
              <OtherActions board={board} />
            </div>
          )}
        </div>

        <div className="flex-1 h-full min-h-0">
          <UndoManagerProvider disabled={!!taskId}>
            <Columns boardId={board.id} columns={board.columns} />
          </UndoManagerProvider>
        </div>
      </div>

      {taskId && <TaskDetail onClose={handleClose} taskId={taskId} />}
    </ModalProvider>
  );
}
