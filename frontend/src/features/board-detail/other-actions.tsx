import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useColumnModalControls,
  useColumnModalState,
} from "@/features/board-detail/column.state";
import { GetBoardsListQueryResult } from "@/lib/zero-queries";
import { DeleteBoard } from "@/features/boards/delete-board";
import { useRouter } from "@tanstack/react-router";

export function OtherActions({
  board,
}: {
  board: GetBoardsListQueryResult[number];
}) {
  const { activeModal } = useColumnModalState();
  const { openModal, closeModal } = useColumnModalControls();
  const router = useRouter();

  const handleBoardDelete = () => {
    openModal({
      type: "delete-board",
      board,
      onClose: () => {
        closeModal();
      },

      onDeleteSuccess: () => {
        closeModal();
        router.navigate({
          to: "/boards",
        });
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="w-8 h-8">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleBoardDelete}
            className="text-red-10! focus:bg-red-3! dark:focus:bg-red-2!"
          >
            Delete board
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {activeModal?.type === "delete-board" && <DeleteBoard {...activeModal} />}
    </>
  );
}
