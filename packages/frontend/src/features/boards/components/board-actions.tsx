import { useBoardModalState } from "@/features/boards/state/board";
import { CreateBoard } from "@/features/boards/components/create-board";
import { DeleteBoard } from "@/features/boards/components/delete-board";
import { EditBoard } from "@/features/boards/components/edit-board";
import { ExportBoards } from "@/features/boards/components/export-boards";
import { ImportBoards } from "@/features/boards/components/import-boards";

export function BoardActions() {
  const { activeModal } = useBoardModalState();

  switch (activeModal?.type) {
    case "create-board":
      return <CreateBoard {...activeModal} />;
    case "edit-board":
      return <EditBoard {...activeModal} />;
    case "delete-board":
      return <DeleteBoard {...activeModal} />;
    case "export-boards":
      return <ExportBoards {...activeModal} />;
    case "import-boards":
      return <ImportBoards {...activeModal} />;
    default:
      return null;
  }
}
