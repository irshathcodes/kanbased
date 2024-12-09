import { Tasks } from "@/features/tasks/tasks";
import { Draggable } from "@hello-pangea/dnd";
import { forwardRef, memo, useCallback } from "react";

export type TaskProps = {
  task: Tasks[number];
  boardName: string;
  previousPosition: number;
  nextPosition: number;
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
          className="select-none"
        >
          <div className="bg-background text-foreground p-2 rounded-md min-h-16">
            {task.name}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export const Task = memo<TaskProps>(TaskComp);
