import {Suspense, lazy, useRef, useState} from "react";
import {useQuery} from "@rocicorp/zero/react";
import {toast} from "sonner";
import {ArrowDown, ArrowUp} from "lucide-react";
import {useHotkeys} from "react-hotkeys-hook";
import {Link, useNavigate, useParams} from "@tanstack/react-router";
import type {CodeMirrorEditorRefData} from "@/components/md-editor/md-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getBoardWithColumnsAndTasksQuery,
  getTaskQuery,
} from "@/lib/zero-queries";
import {Spinner} from "@/components/ui/spinner";
import {useZ} from "@/lib/zero-cache";
import {EditableText} from "@/components/editable-text";
import {Button, buttonVariants} from "@/components/ui/button";
import {WrappedTooltip} from "@/components/ui/tooltip";
import {KeyboardShortcutIndicator} from "@/components/keyboard-shortcut";

const MilkdownEditorLazy = lazy(
  () => import("@/components/md-editor/markdown-editor"),
);

export function TaskDetail(props: {onClose: () => void; taskId: string}) {
  const editorRef = useRef<CodeMirrorEditorRefData>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const {slug} = useParams({from: "/_authenticated/_layout/boards_/$slug"});
  const z = useZ();
  const [data] = useQuery(getTaskQuery(z, props.taskId));
  const [board] = useQuery(getBoardWithColumnsAndTasksQuery(z, slug));
  const tasks =
    board?.columns?.find((col) => col.id === data?.columnId)?.tasks ?? [];
  const activeTaskIndex = tasks.findIndex((task) => task.id === data?.id);
  const previousTaskId = tasks[activeTaskIndex - 1]?.id;
  const nextTaskId = tasks[activeTaskIndex + 1]?.id;

  const navigateToTask = (taskId: string) => {
    navigate({
      to: ".",
      search: {
        taskId,
      },
    });
  };

  useHotkeys("k", () => previousTaskId && navigateToTask(previousTaskId), [
    previousTaskId,
  ]);

  useHotkeys("j", () => nextTaskId && navigateToTask(nextTaskId), [nextTaskId]);

  useHotkeys(
    "Escape",
    () => {
      const vimMode = editorRef.current?.getVimMode();

      if (!vimMode) {
        props.onClose();
      } else {
        // handle escape for vim, because it's not working in Codemirror editor
        editorRef.current?.handleEscapeForVim();
      }
    },
    {enableOnContentEditable: true},
  );

  const handleTitleChange = (updatedTitle: string) => {
    z.mutate.tasksTable.update({
      id: data!.id,
      name: updatedTitle,
    });
  };

  const handleDelete = async () => {
    await z.mutate.tasksTable.update({
      id: data!.id,
      deletedAt: Date.now(),
    });

    toast.success("Task deleted");
    props.onClose();
  };

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const closeButton = document.querySelector("#dialog-close-button");
          (closeButton as HTMLElement | null)?.focus();
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          document.body.style.pointerEvents = "";
        }}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="min-w-11/12 h-11/12 flex flex-col"
      >
        <>
          <DialogHeader className="w-9/12">
            <DialogTitle>
              <EditableText
                inputLabel="Task Name"
                fieldName="name"
                inputClassName="text-xl font-bold w-full"
                buttonClassName="text-xl font-bold"
                defaultValue={data?.name ?? ""}
                defaultMode="view"
                onSubmit={handleTitleChange}
              />
            </DialogTitle>
            <DialogDescription className="sr-only">
              Task detail for {data?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="absolute right-12 top-2 flex items-center">
            <WrappedTooltip tooltipContentProps={{side: "bottom"}}>
              {previousTaskId ? (
                <Link
                  to="."
                  search={{taskId: previousTaskId}}
                  className={buttonVariants({variant: "ghost", size: "icon"})}
                >
                  <ArrowUp />
                </Link>
              ) : (
                <Button variant="ghost" size="icon" disabled>
                  <ArrowUp />
                </Button>
              )}

              <KeyboardShortcutIndicator label="Previous Task">
                K
              </KeyboardShortcutIndicator>
            </WrappedTooltip>

            <WrappedTooltip tooltipContentProps={{side: "bottom"}}>
              {nextTaskId ? (
                <Link
                  to="."
                  search={{taskId: nextTaskId}}
                  className={buttonVariants({variant: "ghost", size: "icon"})}
                >
                  <ArrowDown />
                </Link>
              ) : (
                <Button variant="ghost" size="icon" disabled>
                  <ArrowDown />
                </Button>
              )}

              <KeyboardShortcutIndicator label="Next Task">
                J
              </KeyboardShortcutIndicator>
            </WrappedTooltip>
          </div>

          <div className="min-h-0 flex-1 h-full">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center gap-2">
                  <Spinner />
                  Loading editor...
                </div>
              }
            >
              <MilkdownEditorLazy defaultValue={data?.content ?? ""} />
            </Suspense>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
