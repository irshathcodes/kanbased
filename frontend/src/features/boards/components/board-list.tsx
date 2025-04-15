import { BoardListResponse } from "@/types/api-response-types";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { useBoardModalControls } from "@/features/boards/state/board";
import { GetBoardsListQueryResult } from "@/lib/zero-queries";
import { getRelativeTimeString } from "@/lib/utils";

function BoardItem({ board }: { board: GetBoardsListQueryResult[number] }) {
  const { openModal, closeModal } = useBoardModalControls();

  return (
    <Link
      to="/boards/$boardUrl"
      params={{ boardUrl: board.boardUrl }}
      className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative p-6">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50 transition-opacity group-hover:opacity-70" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-xl tracking-tight line-clamp-1">
              {board.name}
            </h3>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    openModal({
                      type: "edit-board",
                      board,
                      onClose: closeModal,
                    });
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="!text-red-10 focus:!bg-red-3 dark:focus:!bg-red-2"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal({
                      type: "delete-board",
                      board,
                      onClose: closeModal,
                    });
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stats */}
          {/* <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{board.columnsCount ?? 0} columns</span>
              <span className="mx-2">•</span>
              <span>{board.tasksCount ?? 0} tasks</span>
            </div>
          </div> */}

          <div className="flex items-center text-sm text-muted-foreground">
            <span>
              Created {getRelativeTimeString(new Date(board.createdAt))}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BoardList(props: { boards: GetBoardsListQueryResult }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {props.boards?.map((board) => <BoardItem board={board} key={board.id} />)}
    </ul>
  );
}
