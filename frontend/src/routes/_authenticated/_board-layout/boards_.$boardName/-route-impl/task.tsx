import { Tasks } from "@/routes/_authenticated/_board-layout/boards_.$boardName/-route-impl/tasks";
import { cn } from "@/lib/utils";
import { Draggable } from "@hello-pangea/dnd";
import { memo, useCallback } from "react";

export type TaskProps = {
  task: Tasks[number];
  index: number;
  taskRef?: (node: HTMLElement | null) => void;
};

function TaskComp(props: TaskProps) {
  const { task } = props;

  return (
    <Draggable draggableId={task.id} index={props.index}>
      {(provided, snapshot) => (
        <div
          ref={useCallback((node: HTMLDivElement | null) => {
            provided.innerRef(node);
            props.taskRef?.(node);
          }, [])}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <div
            className={cn(
              "text-foreground p-2 rounded-lg min-h-16 break-words border dark:hover:bg-gray-4 hover:bg-gray-3",
              snapshot.isDragging
                ? "shadow-inner bg-gray-4 dark:bg-gray-5 border-gray-10"
                : "dark:border-transparent bg-white dark:bg-gray-3"
            )}
          >
            {task.name}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export const Task = memo<TaskProps>(TaskComp);
