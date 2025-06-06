import {toast} from "sonner";
import type {DeleteBoardModal} from "@/features/boards/board.state";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {useZ} from "@/lib/zero-cache";

export function DeleteBoard(props: DeleteBoardModal) {
  const z = useZ();

  const handleDelete = () => {
    z.mutate.boardsTable.update({
      id: props.board.id,
      deletedAt: Date.now(),
    });

    toast.success(`${props.board.name} board deleted successfully`);
    props.onDeleteSuccess();
  };

  const handleOpenChange = () => {
    props.onClose();
  };

  return (
    <AlertDialog open={true} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete the board {props.board.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will be permanent, but you can undo it from the toast
            message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} type="submit">
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
