import { useBoardModalState } from "@/features/boards/board.state";
import { CreateBoard } from "@/features/boards/create-board";
import { DeleteBoard } from "@/features/boards/delete-board";
import { EditBoard } from "@/features/boards/edit-board";
import { ExportBoards } from "@/features/boards/export-boards";
import { ImportBoards } from "@/features/boards/import-boards";

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
