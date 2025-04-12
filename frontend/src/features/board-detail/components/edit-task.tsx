import { CustomizedTextarea } from "@/components/ui/customized-textarea";
import { useUpdateTaskMutation } from "@/features/board-detail/queries/tasks";
import { useInteractiveOutside } from "@/hooks/use-interactive-outside";
import { ColumnsWithTasksResponse } from "@/types/api-response-types";
import { QueryKey } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

export type EditTaskProps = {
  task: ColumnsWithTasksResponse["tasks"][number];
  onComplete: () => void;
  columnsQueryKey: QueryKey;
  className?: string;
};

export function EditTask(props: EditTaskProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const updateTaskMutation = useUpdateTaskMutation({
    columnsQueryKey: props.columnsQueryKey,
    afterOptimisticUpdate: () => {
      setTimeout(() => {
        props.onComplete();
      }, 0);
    },
  });

  useInteractiveOutside(textAreaRef, () => {
    props.onComplete();
  });

  const handleSubmit = async () => {
    const name = textAreaRef.current!.value;
    const currentDate = new Date().toISOString();

    updateTaskMutation.mutate({
      params: {
        path: {
          taskId: props.task.id,
        },
      },
      body: {
        name,
        updatedAt: currentDate,
      },
    });
  };

  return (
    <div className={props.className}>
      <form>
        <CustomizedTextarea
          name="task"
          ref={useCallback((node: HTMLTextAreaElement | null) => {
            textAreaRef.current = node;

            if (node) {
              node.focus();
              node.setSelectionRange(node.value.length, node.value.length);
              node.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
          }, [])}
          defaultValue={props.task.name}
          required
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();

              if (event.shiftKey) {
                return;
              }

              handleSubmit();
            }
            if (event.key === "Escape") {
              props.onComplete();
            }
          }}
          className="min-h-16 !px-2 resize-none !ring-transparent text-base"
        />
      </form>
    </div>
  );
}
