import { Button, buttonVariants } from "@/components/ui/button";
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
import { Spinner } from "@/components/ui/spinner";
import { useCreateBoardMutation } from "@/features/boards/queries/boards";
import { CreateBoardModal } from "@/features/boards/state/board";
import { getId } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useState, type FormEventHandler } from "react";
import { toast } from "sonner";

export function CreateBoard(props: CreateBoardModal) {
  const createBoardMutation = useCreateBoardMutation();
  const [boardName, setBoardName] = useState("");
  const boardUrl = boardName.toLowerCase().split(" ").join("-");

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();

    createBoardMutation.mutate(
      {
        body: {
          id: getId(),
          name: boardName,
          boardUrl,
          updatedAt: currentDate,
          createdAt: currentDate,
        },
      },
      {
        onSuccess() {
          toast.success(
            <div className="flex items-center justify-between w-full">
              <span>
                <b>{boardName}</b> board created successfully
              </span>
              <Link
                className={buttonVariants({
                  size: "sm",
                  className: "!h-8",
                })}
                to="/boards/$boardUrl"
                params={{ boardUrl }}
              >
                View
              </Link>
            </div>,
          );
          props.onClose();
        },
      },
    );
  };

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent className="!gap-0 sm:max-w-[425px]">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create board</DialogTitle>
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
              Board URL: <b>{boardUrl}</b>
            </p>
          </div>

          <DialogFooter>
            <Button
              disabled={createBoardMutation.isPending}
              type="submit"
              className="w-[72px]"
            >
              {createBoardMutation.isPending ? <Spinner /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
