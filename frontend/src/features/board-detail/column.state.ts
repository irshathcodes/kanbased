import { GetBoardsListQueryResult } from "@/lib/zero-queries";
import { useModalControls, useModalState } from "@/state/modals";

export interface CreateColumnModal {
  type: "create-column";
}

export interface DeleteBoardModal {
  type: "delete-board";
  board: GetBoardsListQueryResult[number];
  onClose: () => void;
  onDeleteSuccess: () => void;
}

type ColumnModalState = CreateColumnModal | DeleteBoardModal | null;

export const useColumnModalState = useModalState<ColumnModalState>;
export const useColumnModalControls = useModalControls<ColumnModalState>;
