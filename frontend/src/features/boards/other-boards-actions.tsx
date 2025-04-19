import { Button } from "@/components/ui/button";
import { useBoardModalControls } from "@/features/boards/board.state";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function OtherActions() {
  const { openModal, closeModal } = useBoardModalControls();

  const handleExportAllBoards = () => {
    openModal({ type: "export-boards", onClose: closeModal });
  };

  const handleImportAllBoards = () => {
    openModal({ type: "import-boards", onClose: closeModal });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportAllBoards}>
          Export data as JSON
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleImportAllBoards}>
          Import data from JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
