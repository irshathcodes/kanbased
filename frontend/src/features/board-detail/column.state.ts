import { useModalControls, useModalState } from "@/state/modals";

export interface CreateColumnModal {
  type: "create-column";
}

type ColumnModalState = CreateColumnModal | null;

export const useColumnModalState = useModalState<ColumnModalState>;
export const useColumnModalControls = useModalControls<ColumnModalState>;
