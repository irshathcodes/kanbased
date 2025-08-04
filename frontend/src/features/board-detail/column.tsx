import {Draggable} from "@hello-pangea/dnd";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  GripVertical,
  MoreVertical,
} from "lucide-react";
import {useRef, useState} from "react";
import {Tooltip as RadixTooltip} from "radix-ui";
import type {GetBoardWithColumnsAndTasksQueryResult} from "@/lib/zero-queries";
import type {TasksRefValue} from "@/features/board-detail/tasks";
import {ColumnWrapper} from "@/components/column-ui";
import {cn} from "@/lib/utils";
import {EditableColumnName} from "@/features/board-detail/editable-column-name";
import {Tasks} from "@/features/board-detail/tasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {DeleteColumn} from "@/features/board-detail/delete-column";
import {useAuthData} from "@/queries/session";
import {FocusScope} from "@/components/focus-scope";
import {KeyboardShortcutIndicator} from "@/components/keyboard-shortcut";
import {FOCUS_TOOLTIP_CLASS} from "@/lib/constants";
import {Separator} from "@/components/ui/separator";

type ColumnProps = {
  column: NonNullable<GetBoardWithColumnsAndTasksQueryResult>["columns"][number];
  index: number;
};

export function Column({column, index}: ColumnProps) {
  const userData = useAuthData();
  const isMember = userData.role === "member";
  const tasksRef = useRef<TasksRefValue>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleUnknownKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "l") {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();

      const nextColumn = document.querySelector(
        `[data-column-index="${index + 1}"]`,
      );

      if (!nextColumn) return;
      const nextTasks = nextColumn.querySelectorAll("[data-kb-focus]");
      const focusEl = (
        nextTasks.length ? nextTasks[0] : nextColumn
      ) as HTMLElement | null;

      focusEl?.focus();
      focusEl?.scrollIntoView();
    } else if (event.key === "ArrowLeft" || event.key === "h") {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      const prevColumn = document.querySelector(
        `[data-column-index="${index - 1}"]`,
      );

      if (!prevColumn) return;
      const prevTasks = prevColumn.querySelectorAll("[data-kb-focus]");
      const focusEl = (
        prevTasks.length ? prevTasks[0] : prevColumn
      ) as HTMLElement | null;

      focusEl?.focus();
      focusEl?.scrollIntoView();
      index === 1 &&
        document.documentElement.scrollTo({
          left: 0,
        });
    } else if (event.key === "t") {
      if (event.ctrlKey || event.metaKey || isMember) return;
      event.preventDefault();
      tasksRef.current?.openAddTaskForm();
    }
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => {
        return (
          <FocusScope
            // If the column is the first column, we need to focus the second element if there are tasks, otherwise focus the first element
            autoFocusElementIndexOnMount={
              index === 0 ? (column.tasks.length > 0 ? 1 : 0) : undefined
            }
            shortcutType="list"
            eventListenerType="parent"
            onUnknownKeyDown={handleUnknownKeyDown}
          >
            <ColumnWrapper
              ref={provided.innerRef}
              {...provided.draggableProps}
              id={`col-${column.id}`}
              className={cn(
                "mx-2 default-focus-ring",
                snapshot.isDragging && "border-gray-10! shadow-xl!",
              )}
              data-kb-focus
              tabIndex={-1}
              data-column-index={index}
              onFocus={(e) => {
                if (e.target === e.currentTarget) {
                  setIsFocused(true);
                }
              }}
              onBlur={() => setIsFocused(false)}
            >
              <RadixTooltip.Provider>
                <RadixTooltip.Root open={isFocused} delayDuration={1000}>
                  <RadixTooltip.Trigger asChild>
                    <div className="flex items-center justify-between shrink-0 pt-1">
                      <div
                        className="cursor-grab text-muted-foreground w-8 grid place-content-center h-8 hover:text-foreground shrink-0 hover:bg-grayA-4 active:bg-grayA-4 rounded-lg active:cursor-grabbing mr-1.5"
                        {...provided.dragHandleProps}
                      >
                        <GripVertical size={16} />
                      </div>

                      <EditableColumnName
                        columnName={column.name}
                        columnId={column.id}
                        readonly={isMember}
                      />

                      {!isMember && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="text-muted-foreground w-8 grid place-content-center h-8 hover:text-foreground shrink-0 hover:bg-grayA-4 active:bg-grayA-4 rounded-lg ml-2"
                              type="button"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <DeleteColumn columnId={column.id} />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </RadixTooltip.Trigger>

                  <RadixTooltip.Content
                    side="top"
                    sideOffset={12}
                    className={FOCUS_TOOLTIP_CLASS}
                    hidden={isMember}
                  >
                    <div className="flex gap-2 items-center text-xs">
                      <div>
                        <KeyboardShortcutIndicator>t</KeyboardShortcutIndicator>
                        {"  "}
                        to add
                      </div>

                      <Separator orientation="vertical" className="h-4" />

                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                          <KeyboardShortcutIndicator>
                            <ArrowUp size={12} />
                          </KeyboardShortcutIndicator>
                          <KeyboardShortcutIndicator>
                            <ArrowDown size={12} />
                          </KeyboardShortcutIndicator>
                          <KeyboardShortcutIndicator>
                            <ArrowLeft size={12} />
                          </KeyboardShortcutIndicator>
                          <KeyboardShortcutIndicator>
                            <ArrowRight size={12} />
                          </KeyboardShortcutIndicator>
                        </div>

                        <span>to navigate</span>
                      </div>
                    </div>
                  </RadixTooltip.Content>
                </RadixTooltip.Root>
              </RadixTooltip.Provider>

              <Tasks
                tasks={column.tasks}
                columnId={column.id}
                readonly={isMember}
                ref={tasksRef}
              />
            </ColumnWrapper>
          </FocusScope>
        );
      }}
    </Draggable>
  );
}
