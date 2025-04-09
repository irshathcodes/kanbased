import { Button } from "@/components/ui/button";
import { EditTask } from "@/features/board-detail/components/edit-task";
import { useDeleteTaskMutation } from "@/features/board-detail/queries/tasks";
import { cn } from "@/lib/utils";
import { ColumnsWithTasksResponse } from "@/types/api-response-types";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { QueryKey } from "@tanstack/react-query";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { memo, useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";

export type TaskProps = {
  task: ColumnsWithTasksResponse["tasks"][number];
  index: number;
  columnsQueryKey: QueryKey;
};

function ViewTask(props: {
  taskProps: TaskProps;
  dndProps: { provided: DraggableProvided; snapshot: DraggableStateSnapshot };
  onEdit: () => void;
}) {
  const { task, columnsQueryKey } = props.taskProps;
  const { provided, snapshot } = props.dndProps;

  const deleteTaskMutation = useDeleteTaskMutation({
    columnsQueryKey: columnsQueryKey,
  });

  const linkRef = useCallback((node: HTMLAnchorElement | null) => {
    provided.innerRef(node);
  }, []);

  return (
    <Link
      ref={linkRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={cn(
        "group mb-2.5 block !cursor-default overflow-x-hidden rounded-lg border text-foreground dark:hover:bg-gray-4 hover:bg-gray-3 focus:ring outline-none",
        snapshot.isDragging
          ? "shadow-inner bg-gray-4 dark:bg-gray-5 border-gray-10"
          : "dark:border-transparent bg-white dark:bg-gray-3",
      )}
      id={`task-${task.id}`}
      to="."
      search={{ taskId: task.id }}
      replace
      preload={false}
    >
      <div className={cn("p-2 min-h-16 flex justify-between gap-1")}>
        <span className="break-words">{task.name}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 shrink-0 transition-opacity text-muted-foreground hover:text-foreground w-7 h-7 hover:bg-gray-5 focus:opacity-100"
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
                deleteTaskMutation.mutate({
                  params: {
                    path: {
                      taskId: task.id,
                    },
                  },
                });
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
}

function TaskComp(props: TaskProps) {
  const { task } = props;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Draggable draggableId={task.id} index={props.index}>
      {(provided, snapshot) => (
        <>
          {isEditing ? (
            <EditTask
              task={task}
              columnsQueryKey={props.columnsQueryKey}
              onComplete={() => {
                setIsEditing(false);
              }}
              className="mb-2.5"
            />
          ) : (
            <ViewTask
              taskProps={props}
              dndProps={{ provided, snapshot }}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </>
      )}
    </Draggable>
  );
}

export const Task = memo<TaskProps>(TaskComp);
