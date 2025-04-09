import { Button } from "@/components/ui/button";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useColumnModalControls } from "@/features/board-detail/state/column";
import { CirclePlus } from "lucide-react";

export function CreateColumnButton() {
  const { openModal } = useColumnModalControls();

  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        <Button
          onClick={() => openModal({ type: "create-column" })}
          size="icon"
          className="w-10 h-9"
          aria-label="Add column"
        >
          <CirclePlus size={24} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Create column</TooltipContent>
    </TooltipRoot>
  );
}
