"use client";

import { createFileRoute, linkOptions } from "@tanstack/react-router";
import { BoardList } from "@/features/boards/components/board-list";
import { BoardActions } from "@/features/boards/components/board-actions";
import { ModalProvider } from "@/state/modals";
import { CreateBoardButton } from "@/features/boards/components/create-board-button";
import { OtherActions } from "@/features/boards/components/other-boards-actions";
import { useZ } from "@/lib/zero-cache";
import { useQuery } from "@rocicorp/zero/react";
import { getBoardsListQuery } from "@/lib/zero-queries";

export const Route = createFileRoute("/_authenticated/_layout/boards")({
  component: BoardsPage,
  loader: async () => {
    return {
      breadcrumbs: linkOptions([
        {
          label: "Boards",
          to: "/boards",
        },
      ]),
    };
  },
});

function BoardsPage() {
  const z = useZ();
  const boardsQuery = getBoardsListQuery(z);
  const [boards, status] = useQuery(boardsQuery);

  return (
    <ModalProvider>
      <div className="container mx-auto px-6 py-8 w-full">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Boards ({boards?.length || 0})
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and organize your boards
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CreateBoardButton />
              <OtherActions />
            </div>
          </div>

          {boards?.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
              <h1 className="text-xl font-bold mb-1">No boards yet</h1>
              <p className="text-muted-foreground mb-4 text-sm">
                Create your first board to get started!
              </p>

              <CreateBoardButton size="sm" />
            </div>
          ) : (
            <BoardList boards={boards} />
          )}
        </div>
      </div>
      <BoardActions />
    </ModalProvider>
  );
}
