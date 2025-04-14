"use client";
import { queryClient } from "@/lib/query-client";

import { createFileRoute, linkOptions } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { boardsQueryOptions as getBoardsQueryOptions } from "@/lib/query-options-factory";
import { BoardList } from "@/features/boards/components/board-list";
import { BoardActions } from "@/features/boards/components/board-actions";
import { ModalProvider } from "@/state/modals";
import { CreateBoardButton } from "@/features/boards/components/create-board-button";
import { OtherActions } from "@/features/boards/components/other-boards-actions";
import { getActiveOrganizationId } from "@/queries/session";
import { useZ } from "@/lib/zero-cache";
import { useQuery } from "@rocicorp/zero/react";

export const Route = createFileRoute("/_authenticated/_layout/boards")({
  component: BoardsPage,
  loader: async () => {
    const orgId = getActiveOrganizationId(queryClient);
    const boardsQueryOptions = getBoardsQueryOptions({ orgId });
    await queryClient.prefetchQuery(boardsQueryOptions);

    return {
      breadcrumbs: linkOptions([
        {
          label: "Boards",
          to: "/boards",
        },
      ]),
      boardsQueryOptions,
    };
  },
});

function BoardsPage() {
  // const { boardsQueryOptions } = Route.useLoaderData();
  // const { data: boards } = useSuspenseQuery(boardsQueryOptions);

  const z = useZ();
  const boardsQuery = z.query.boardsTable;
  const [boards] = useQuery(boardsQuery);

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
