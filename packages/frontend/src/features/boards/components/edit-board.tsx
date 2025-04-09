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
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/openapi-react-query";
import { queryClient } from "@/lib/query-client";
import { useState, type FormEventHandler } from "react";
import { toast } from "sonner";
import { boardsQueryOptions } from "@/lib/query-options-factory";
import { EditBoardModal } from "@/features/boards/state/board";
import { useActiveOrganizationId } from "@/queries/session";

export function EditBoard(props: EditBoardModal) {
  const { board } = props;
  const [boardName, setBoardName] = useState(board.name);
  const boardUrl = boardName.toLowerCase().split(" ").join("-");
  const orgId = useActiveOrganizationId();
  const { mutate, isPending } = api.useMutation(
    "patch",
    "/api/v1/boards/{boardId}",
  );

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();
    const boardsQueryKey = boardsQueryOptions({ orgId }).queryKey;

    mutate(
      {
        body: {
          name: boardName,
          boardUrl,
          updatedAt: currentDate,
        },
        params: {
          path: { boardId: board.id },
        },
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: boardsQueryKey });
          toast.success("Board updated successfully");
          props.onClose();
        },
      },
    );
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
              Board URL: <b>{boardUrl}</b>
            </p>
          </div>

          <DialogFooter>
            <Button disabled={isPending} type="submit" className="w-[72px]">
              {isPending ? <Spinner /> : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
