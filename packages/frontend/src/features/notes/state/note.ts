import { useModalControls, useModalState } from "@/state/modals";

export interface CreateNoteModal {
  type: "create-note";
  onClose: () => void;
}

type NoteModalState = CreateNoteModal | null;

export const useNoteModalState = useModalState<NoteModalState>;
export const useNoteModalControls = useModalControls<NoteModalState>;
