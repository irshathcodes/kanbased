import {Suspense, lazy, useRef, useState} from "react";
import {useQuery} from "@rocicorp/zero/react";
import {toast} from "sonner";
import {ArrowDown, ArrowUp, Info} from "lucide-react";
import {useHotkeys} from "react-hotkeys-hook";
import {Link, useNavigate, useParams} from "@tanstack/react-router";
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

import {EllipsisVertical, Trash2} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {MilkdownEditorRef} from "@/components/md-editor/markdown-editor";
import {cn} from "@/lib/utils";
import {useDirtyEditorBlock} from "@/hooks/use-dirty-editor-block";

const MarkdownEditorLazy = lazy(
  () => import("@/components/md-editor/markdown-editor"),
);

export function TaskDetail(props: {onClose: () => void; taskId: string}) {
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
  const editorRef = useRef<MilkdownEditorRef>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [hasFocused, setHasFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

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
    "f",
    () => {
      editorRef.current?.focus();
    },
    {preventDefault: true},
  );

  useHotkeys("Escape", () => props.onClose(), {enableOnContentEditable: true});

  useHotkeys("mod+s", () => handleSave(), [isDirty], {
    preventDefault: true,
    enableOnContentEditable: true,
  });

  useDirtyEditorBlock(() => {
    if (!isDirty) return false;

    const defaultContent = data?.content ?? "";
    const currentContent = editorRef.current?.getMarkdown();

    return currentContent !== defaultContent;
  });

  const handleSave = () => {
    z.mutate.tasksTable.update({
      id: props.taskId,
      updatedAt: Date.now(),
      content: editorRef.current?.getMarkdown(),
    });

    timeoutRef.current && clearTimeout(timeoutRef.current);
    setIsDirty(false);
    toast.success("Task updated");
  };

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

          {!hasFocused && (
            <div className="absolute bottom-0 right-0 text-muted-foreground text-xs p-2 flex items-center gap-1">
              <Info className="w-4 h-4" />
              Pro tip: Press{" "}
              <KeyboardShortcutIndicator>f</KeyboardShortcutIndicator> to focus
              on the editor
            </div>
          )}

          <div className="flex-1 h-full flex flex-col min-h-0">
            <div className="ml-auto shrink-0 flex items-center gap-3">
              <Button
                onClick={handleSave}
                type="button"
                size="sm"
                className={cn(
                  "h-9 transition-opacity duration-300",
                  isDirty ? "visible opacity-100" : "invisible opacity-0",
                )}
              >
                <>
                  <span>Save</span>
                  <KeyboardShortcutIndicator commandOrCtrlKey>
                    S
                  </KeyboardShortcutIndicator>
                </>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="size-8">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="!text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    Delete task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div
              className="overflow-y-auto flex-1"
              ref={containerRef}
              tabIndex={-1}
              onClick={(e) => {
                // Only focus if clicking outside the editor content area
                const editorElement = document.querySelector(".milkdown");
                if (
                  editorElement &&
                  !editorElement.contains(e.target as Node)
                ) {
                  editorRef.current?.focus();
                }
              }}
            >
              <div className="min-h-0 flex-1 h-full mx-auto w-full max-w-3xl flex justify-center *:w-full *:h-full">
                {data !== undefined && (
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex items-center justify-center gap-2">
                        <Spinner />
                        Loading editor...
                      </div>
                    }
                  >
                    <MarkdownEditorLazy
                      defaultValue={data.content ?? ""}
                      ref={editorRef}
                      onChange={(updatedMarkdown) => {
                        if (timeoutRef.current) {
                          clearTimeout(timeoutRef.current);
                        }

                        timeoutRef.current = setTimeout(() => {
                          setIsDirty(updatedMarkdown !== (data.content ?? ""));
                        }, 1000);
                      }}
                      onFocus={() => {
                        containerRef.current?.scrollTo({
                          top: containerRef.current.scrollHeight,
                        });
                        setHasFocused(true);
                      }}
                      key={data.id}
                    />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
