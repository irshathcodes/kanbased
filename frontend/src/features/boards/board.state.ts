import { GetBoardsListQueryResult } from "@/lib/zero-queries";
import { useModalControls, useModalState } from "@/state/modals";

export interface CreateBoardModal {
  type: "create-board";
  onClose: () => void;
}

export interface EditBoardModal {
  type: "edit-board";
  board: GetBoardsListQueryResult[number];
  onClose: () => void;
}

export interface DeleteBoardModal {
  type: "delete-board";
  board: GetBoardsListQueryResult[number];
  onDeleteSuccess: () => void;
  onClose: () => void;
}

export interface ExportBoardsModal {
  type: "export-boards";
  onClose: () => void;
}

export interface ImportBoardsModal {
  type: "import-boards";
  onClose: () => void;
}

type BoardModalState =
  | CreateBoardModal
  | DeleteBoardModal
  | EditBoardModal
  | ExportBoardsModal
  | ImportBoardsModal
  | null;

export const useBoardModalState = useModalState<BoardModalState>;
export const useBoardModalControls = useModalControls<BoardModalState>;
