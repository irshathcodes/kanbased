import { Button } from "@/components/ui/button";
import { useNoteModalControls } from "@/features/notes/state/note";
import { CirclePlus } from "lucide-react";

export function CreateNoteButton({ size }: { size?: "sm" | "lg" }) {
  const { openModal, closeModal } = useNoteModalControls();

  return (
    <Button
      size={size}
      onClick={() => openModal({ type: "create-note", onClose: closeModal })}
      className="gap-2"
    >
      <CirclePlus className="w-5 h-5" />
      Create Note
    </Button>
  );
}
