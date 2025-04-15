import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type FormEventHandler } from "react";
import { toast } from "sonner";
import { EditBoardModal } from "@/features/boards/state/board";
import { useZ } from "@/lib/zero-cache";

export function EditBoard(props: EditBoardModal) {
  const { board } = props;
  const [boardName, setBoardName] = useState(board.name);
  const slug = boardName.toLowerCase().split(" ").join("-");
  const z = useZ();

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    z.mutate.boardsTable.update({
      id: board.id,
      name: boardName,
      slug,
      updatedAt: Date.now(),
    });

    toast.success("Board updated successfully");

    props.onClose();
  };

  const handleOpenChange = () => {
    props.onClose();
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="!gap-0 sm:max-w-[425px]">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit board</DialogTitle>
          </DialogHeader>

          <div className="grid gap-2 mt-4 mb-2">
            <Label htmlFor="board-name">Board Name</Label>
            <Input
              id="board-name"
              name="board-name"
              placeholder="eg: work board"
              required
              value={boardName}
              onChange={(e) => setBoardName(e.target.value ?? "")}
            />
            <DialogDescription className="!text-xs">
              Enter a unique name that reflects the purpose of this board.
            </DialogDescription>

            <p className="text-xs">
              Board URL: <b>{slug}</b>
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-[72px]">
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
