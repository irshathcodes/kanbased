import { Button } from "@/components/ui/button";
import { EditTask } from "@/features/board-detail/edit-task";
import { cn } from "@/lib/utils";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { memo, useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { GetBoardWithColumnsAndTasksQueryResult } from "@/lib/zero-queries";
import { useZ } from "@/lib/zero-cache";
import UserAvatar from "@/components/user-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type TaskProps = {
  task: NonNullable<GetBoardWithColumnsAndTasksQueryResult>["columns"][number]["tasks"][number];
  index: number;
};

function ViewTask(props: {
  taskProps: TaskProps;
  dndProps: { provided: DraggableProvided; snapshot: DraggableStateSnapshot };
  onEdit: () => void;
}) {
  const { task } = props.taskProps;
  const { provided, snapshot } = props.dndProps;
  const z = useZ();

  const handleDeleteTask = () => {
    z.mutate.tasksTable.update({
      id: task.id,
      deletedAt: Date.now(),
    });
  };

  return (
    <Link
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={cn(
        "group mb-2.5 block cursor-default! overflow-x-hidden rounded-lg border text-foreground dark:hover:bg-gray-4 hover:bg-gray-3 focus:ring-3 outline-hidden",
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
        <span
          style={{
            overflowWrap: "anywhere",
          }}
        >
          {task.name}
        </span>

        <div className="shrink-0 flex flex-col justify-between gap-1.5">
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
                  handleDeleteTask();
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger className="self-end">
                <UserAvatar
                  name={task.creator?.name ?? ""}
                  imageUrl={task.creator?.image ?? ""}
                  className="w-5 h-5 opacity-0 group-hover:opacity-90 shrink-0 transition-opacity focus:opacity-90"
                />
              </TooltipTrigger>

              <TooltipContent>
                <span>Created by: {task.creator?.name}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
