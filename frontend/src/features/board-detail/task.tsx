import {Draggable} from "@hello-pangea/dnd";
import {MoreVertical, Pencil, Trash2} from "lucide-react";
import {memo, useCallback, useState} from "react";
import {Link} from "@tanstack/react-router";
import {useHotkeys} from "react-hotkeys-hook";
import {flushSync} from "react-dom";
import {toast} from "sonner";
import {Tooltip as RadixTooltip} from "radix-ui";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import type {GetBoardWithColumnsAndTasksQueryResult} from "@/lib/zero-queries";
import {Button} from "@/components/ui/button";
import {EditTask} from "@/features/board-detail/edit-task";
import {cn} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useZ} from "@/lib/zero-cache";
import {useFocusManager} from "@/components/focus-scope";
import {useUndoManager} from "@/state/undo-manager";
import {FOCUS_TOOLTIP_CLASS, ModKey} from "@/lib/constants";
import {useDelayedFocusIndicator} from "@/hooks/use-focus-indicator";
import {KeyboardShortcutIndicator} from "@/components/keyboard-shortcut";
import {AssigneeCombobox} from "@/features/board-detail/assignee-combobox";
import {useAssignee} from "@/features/board-detail/use-assignee";

export type TaskProps = {
  task: NonNullable<GetBoardWithColumnsAndTasksQueryResult>["columns"][number]["tasks"][number];
  index: number;
  readonly?: boolean;
};

function ViewTask(props: {
  taskProps: TaskProps;
  dndProps: {provided: DraggableProvided; snapshot: DraggableStateSnapshot};
  onEdit: () => void;
  readonly?: boolean;
}) {
  const {task} = props.taskProps;
  const {provided, snapshot} = props.dndProps;
  const z = useZ();
  const focusManager = useFocusManager();
  const undoManager = useUndoManager();
  const {isFocused, showIndicatorDelayed, hideIndicator} =
    useDelayedFocusIndicator({
      isDisabled: props.readonly,
    });

  const {assigneeComboboxOpen, setAssigneeComboboxOpen, handleAssigneeChange} =
    useAssignee({
      taskId: task.id,
    });

  const editHotkeyRef = useHotkeys(
    "i",
    () => {
      if (!props.readonly) {
        props.onEdit();
      }
    },
    {
      preventDefault: true,
    },
  );

  const deleteHotkeyRef = useHotkeys(
    "shift+d",
    () => {
      if (!props.readonly) {
        handleDeleteTask();
      }
    },
    {
      preventDefault: true,
    },
  );

  const openAssigneeComboboxHotkeyRef = useHotkeys(
    "a",
    () => {
      if (!props.readonly) {
        setAssigneeComboboxOpen(true);
      }
    },
    {
      preventDefault: true,
    },
  );

  const handleDeleteTask = () => {
    const execute = () => {
      z.mutate.tasksTable.update({
        id: task.id,
        deletedAt: Date.now(),
      });
    };

    const undo = () => {
      z.mutate.tasksTable.update({
        id: task.id,
        deletedAt: null,
      });
    };

    undoManager.add({
      execute,
      undo,
    });

    toast.success("Task deleted", {
      action: {
        label: `Undo (${ModKey}+Z)`,
        onClick: () => undoManager.undo(),
      },
    });

    focusManager.focusNext();
  };

  return (
    <Link
      ref={useCallback((el: HTMLAnchorElement) => {
        provided.innerRef(el);
        editHotkeyRef.current = el;
        deleteHotkeyRef.current = el;
        openAssigneeComboboxHotkeyRef.current = el;
      }, [])}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={cn(
        "group mb-2.5 block cursor-default! overflow-x-hidden rounded-lg border text-foreground dark:hover:bg-gray-4 hover:bg-gray-3 default-focus-ring relative",
        snapshot.isDragging
          ? "shadow-inner bg-gray-4 dark:bg-gray-5 border-gray-10"
          : "dark:border-transparent bg-white dark:bg-gray-3",
      )}
      id={`task-${task.id}`}
      to="."
      search={{taskId: task.id}}
      replace
      data-kb-focus
      onFocus={showIndicatorDelayed}
      onBlur={hideIndicator}
    >
      <RadixTooltip.Provider>
        <RadixTooltip.Root open={isFocused} delayDuration={1000}>
          <RadixTooltip.Trigger asChild>
            <div className={cn("p-2 min-h-16 flex justify-between gap-1")}>
              <span
                style={{
                  overflowWrap: "anywhere",
                }}
              >
                {task.name}
              </span>

              <div className="shrink-0 flex flex-col justify-between gap-1.5">
                {!props.readonly && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 text-muted-foreground hover:text-foreground w-7 h-7 hover:bg-gray-5 opacity-0 group-hover:opacity-90 transition-opacity group-focus:opacity-90 self-end aria-expanded:opacity-90"
                        variant="ghost"
                        size="icon"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          props.onEdit();
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask();
                        }}
                        className="!text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <AssigneeCombobox
                  assignee={task.assignee ?? null}
                  onAssigneeChange={handleAssigneeChange}
                  isOpen={assigneeComboboxOpen}
                  onOpenChange={setAssigneeComboboxOpen}
                  isDisabled={props.readonly}
                />
              </div>
            </div>
          </RadixTooltip.Trigger>

          <RadixTooltip.Content
            side="bottom"
            className={FOCUS_TOOLTIP_CLASS}
            sideOffset={6}
          >
            <div className="flex gap-4 items-center text-xs">
              <div>
                <KeyboardShortcutIndicator>i</KeyboardShortcutIndicator> to edit
              </div>

              <div>
                <KeyboardShortcutIndicator>shift + D</KeyboardShortcutIndicator>{" "}
                to delete
              </div>
            </div>
          </RadixTooltip.Content>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    </Link>
  );
}

function TaskComp(props: TaskProps) {
  const {task} = props;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Draggable draggableId={task.id} index={props.index}>
      {(provided, snapshot) => (
        <>
          {isEditing ? (
            <EditTask
              task={task}
              onComplete={() => {
                flushSync(() => {
                  setIsEditing(false);
                });
                document.getElementById(`task-${task.id}`)?.focus();
              }}
              className="mb-2.5"
            />
          ) : (
            <ViewTask
              taskProps={props}
              dndProps={{provided, snapshot}}
              onEdit={() => setIsEditing(true)}
              readonly={props.readonly}
            />
          )}
        </>
      )}
    </Draggable>
  );
}

export const Task = memo<TaskProps>(TaskComp);
