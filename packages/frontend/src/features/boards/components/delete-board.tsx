import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/openapi-react-query";
import { queryClient } from "@/lib/query-client";
import { boardsQueryOptions } from "@/lib/query-options-factory";
import { toast } from "sonner";
import { DeleteBoardModal } from "@/features/boards/state/board";
import { useActiveOrganizationId } from "@/queries/session";

export function DeleteBoard(props: DeleteBoardModal) {
  const deleteBoardMutation = api.useMutation(
    "patch",
    "/api/v1/boards/{boardId}/toggle-delete",
  );
  const orgId = useActiveOrganizationId();
  const boardsQueryKey = boardsQueryOptions({ orgId }).queryKey;

  const handleUndoDelete = (boardId: string) => {
    toast.promise(
      deleteBoardMutation.mutateAsync(
        {
          params: { path: { boardId } },
          body: { deleted: false },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardsQueryKey });
          },
        },
      ),
      {
        loading: "Restoring board...",
        success: "Board restored successfully",
        error: "Failed to restore board",
      },
    );
  };

  const handleDelete = async () => {
    await deleteBoardMutation.mutateAsync(
      {
        params: { path: { boardId: props.board.id } },
        body: { deleted: true },
      },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({ queryKey: boardsQueryKey });

          toast.success(
            <div className="flex items-center justify-between w-full">
              <span>
                <b>{result.name}</b> board deleted successfully
              </span>
              <button
                className={buttonVariants({
                  size: "sm",
                  className: "!h-8",
                })}
                onClick={() => handleUndoDelete(result.id)}
              >
                Undo
              </button>
            </div>,
          );

          props.onClose();
        },
      },
    );
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
          <Button
            disabled={deleteBoardMutation.isPending}
            variant="destructive"
            onClick={handleDelete}
            type="submit"
          >
            {deleteBoardMutation.isPending ? (
              <>
                <Spinner />
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
