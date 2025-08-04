import {Suspense, lazy, useRef, useState} from "react";
import {useQuery} from "@rocicorp/zero/react";
import {toast} from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  EllipsisVertical,
  Info,
  Trash2,
} from "lucide-react";
import {useHotkeys} from "react-hotkeys-hook";
import {Link, useNavigate, useParams} from "@tanstack/react-router";
import type {MilkdownEditorRef} from "@/components/md-editor/markdown-editor";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useDirtyEditorBlock} from "@/hooks/use-dirty-editor-block";
import {useAuthData} from "@/queries/session";
import {AssigneeCombobox} from "@/features/board-detail/assignee-combobox";
import {useAssignee} from "@/features/board-detail/use-assignee";

const MarkdownEditorLazy = lazy(
  () => import("@/components/md-editor/markdown-editor"),
);

export function TaskDetail(props: {onClose: () => void; taskId: string}) {
  const navigate = useNavigate();
  const {boardId} = useParams({
    from: "/_authenticated/_layout/boards_/$boardId",
  });
  const userData = useAuthData();
  const z = useZ();
  const [data] = useQuery(getTaskQuery(z, props.taskId));
  const [board] = useQuery(getBoardWithColumnsAndTasksQuery(z, boardId));
  const tasks =
    board?.columns?.find((col) => col.id === data?.columnId)?.tasks ?? [];
  const activeTaskIndex = tasks.findIndex((task) => task.id === data?.id);
  const previousTaskId = tasks[activeTaskIndex - 1]?.id;
  const nextTaskId = tasks[activeTaskIndex + 1]?.id;
  const editorRef = useRef<MilkdownEditorRef>(null);
  const [hasFocused, setHasFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMember = userData.role === "member";
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const {assigneeComboboxOpen, setAssigneeComboboxOpen, handleAssigneeChange} =
    useAssignee({
      taskId: data?.id ?? "",
    });

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

  useHotkeys(
    "mod+s",
    () => {
      handleSave(editorRef.current!.getMarkdown());
      toast.success("Task updated");
    },
    {
      preventDefault: true,
      enableOnContentEditable: true,
    },
  );

  useHotkeys(
    "a",
    () => {
      if (!isMember) {
        setAssigneeComboboxOpen(true);
      }
    },
    {
      preventDefault: true,
    },
  );

  useDirtyEditorBlock(() => {
    const currentContent = editorRef.current?.getMarkdown();
    const hasChanges =
      currentContent !== undefined &&
      data?.content !== undefined &&
      currentContent !== data.content;

    if (hasChanges) {
      handleSave(currentContent);
    }

    return false;
  });

  const handleSave = (updatedMarkdown: string) => {
    z.mutate.tasksTable.update({
      id: data!.id,
      updatedAt: Date.now(),
      content: updatedMarkdown,
    });
  };

  const handleTitleChange = (updatedTitle: string) => {
    z.mutate.tasksTable.update({
      id: data!.id,
      name: updatedTitle,
    });
  };

  const handleCopyMarkdown = () => {
    const markdownContent = editorRef.current?.getMarkdown() ?? "";
    // Clean the markdown by removing <br /> tags and other HTML tags
    const cleanMarkdown = markdownContent
      .replace(/<br\s*\/?>/gi, "\n") // Replace <br /> with actual line breaks
      .replace(/<[^>]*>/g, ""); // Remove any other HTML tags

    navigator.clipboard.writeText(cleanMarkdown);
    toast.success("Content copied to clipboard");
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
                defaultReadOnly={isMember}
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
              <AssigneeCombobox
                assignee={data?.assignee ?? null}
                onAssigneeChange={handleAssigneeChange}
                isOpen={assigneeComboboxOpen}
                onOpenChange={setAssigneeComboboxOpen}
                isDisabled={isMember}
              />
              {!isMember && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="size-8">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCopyMarkdown}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy content as markdown
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="!text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      Delete task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
                      defaultReadOnly={isMember}
                      ref={editorRef}
                      onChange={(updatedMarkdown) => {
                        if (timeoutRef.current) {
                          clearTimeout(timeoutRef.current);
                        }

                        timeoutRef.current = setTimeout(() => {
                          if (updatedMarkdown !== data.content) {
                            handleSave(updatedMarkdown);
                          }
                        }, 2000);
                      }}
                      onFocus={() => {
                        containerRef.current?.scrollTo({
                          top: containerRef.current.scrollHeight,
                        });
                        setHasFocused(true);
                      }}
                      key={data.id}
                      placeholder={
                        data.content
                          ? "Type / for commands"
                          : "Enter description..."
                      }
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
