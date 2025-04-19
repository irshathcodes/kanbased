import { Button } from "@/components/ui/button";
import { useBoardModalControls } from "@/features/boards/board.state";
import { CirclePlus } from "lucide-react";

export function CreateBoardButton({ size }: { size?: "sm" | "lg" }) {
  const { openModal, closeModal } = useBoardModalControls();

  return (
    <Button
      size={size}
      onClick={() => openModal({ type: "create-board", onClose: closeModal })}
      className="gap-2"
    >
      <CirclePlus className="w-5 h-5" />
      Create Board
    </Button>
  );
}
