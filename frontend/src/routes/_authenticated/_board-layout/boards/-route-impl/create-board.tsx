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
import { api } from "@/lib/openapi-react-query";
import { queryClient } from "@/lib/query-client";
import { getId } from "@/lib/utils";
import { Route } from "@/routes/_authenticated/_board-layout/boards/route";
import { Link } from "@tanstack/react-router";
import { type FormEventHandler } from "react";
import { toast } from "sonner";

export function CreateBoard(props: { onClose: () => void }) {
  const { mutate, isPending } = api.useMutation("post", "/boards");
  const boardsQueryKey = Route.useRouteContext({
    select: (data) => data.boardsQueryOptions.queryKey,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const boardName = fd.get("board-name") as string;
    const currentDate = new Date().toISOString();
    mutate(
      {
        body: {
          id: getId(),
          name: boardName,
          updatedAt: currentDate,
          createdAt: currentDate,
        },
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: boardsQueryKey });
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
                to="/boards/$boardName"
                params={{ boardName }}
              >
                View
              </Link>
            </div>
          );
          props.onClose();
        },
      }
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
            />
            <DialogDescription className="!text-xs">
              Enter a unique name that reflects the purpose of this board.
            </DialogDescription>
          </div>

          <DialogFooter>
            <Button disabled={isPending} type="submit" className="w-[72px]">
              {isPending ? <Spinner /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
