import React, {memo, useImperativeHandle, useRef, useState} from "react";
import {flushSync} from "react-dom";
import {Droppable} from "@hello-pangea/dnd";
import type {GetBoardWithColumnsAndTasksQueryResult} from "@/lib/zero-queries";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Task} from "@/features/board-detail/task";
import {CreateTask} from "@/features/board-detail/create-task";

function TaskList(props: {
  tasks: NonNullable<GetBoardWithColumnsAndTasksQueryResult>["columns"][number]["tasks"];
  columnId: string;
  readonly?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={props.ref} className="min-h-8 px-2 mt-1">
      {props.tasks.map((task, i) => {
        return (
          <Task task={task} key={task.id} index={i} readonly={props.readonly} />
        );
      })}
    </div>
  );
}

const MemoizedTaskList = memo<React.ComponentProps<typeof TaskList>>(TaskList);

export type TasksRefValue = {openAddTaskForm: () => void};
export function Tasks(props: {
  tasks: NonNullable<GetBoardWithColumnsAndTasksQueryResult>["columns"][number]["tasks"];
  columnId: string;
  readonly?: boolean;
  ref: React.Ref<TasksRefValue>;
}) {
  const [showAddTask, setShowAddTask] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const addTaskButtonRef = useRef<HTMLButtonElement | null>(null);
  const sortedTasks = props.tasks;

  const scrollListToEnd = () => {
    containerRef.current?.scrollTo({top: containerRef.current.scrollHeight});
  };

  const openAddTaskForm = () => {
    flushSync(() => {
      setShowAddTask(true);
    });
    scrollListToEnd();
  };

  useImperativeHandle(props.ref, () => ({
    openAddTaskForm,
  }));

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Droppable
        droppableId={props.columnId}
        type="TASK"
        ignoreContainerClipping={false}
        isCombineEnabled={false}
      >
        {(droppableProvided) => {
          return (
            <div
              className={cn(
                "custom-scrollbar grow min-h-0 overflow-y-auto overflow-x-hidden",
              )}
              {...droppableProvided.droppableProps}
              ref={containerRef}
            >
              <MemoizedTaskList
                columnId={props.columnId}
                tasks={props.tasks}
                readonly={props.readonly}
                ref={droppableProvided.innerRef}
              />

              {droppableProvided.placeholder}
            </div>
          );
        }}
      </Droppable>

      <div className="shrink-0 mx-2 mt-3">
        {showAddTask ? (
          <CreateTask
            columnId={props.columnId}
            nextPosition={
              sortedTasks.length
                ? sortedTasks[sortedTasks.length - 1]!.position + 1
                : 1000
            }
            firstPosition={sortedTasks.length ? sortedTasks[0]!.position : 1000}
            onComplete={() => {
              flushSync(() => {
                setShowAddTask(false);
              });

              addTaskButtonRef.current?.focus();
            }}
            onAdd={(insertPosition) => {
              if (insertPosition === "prepend") {
                containerRef.current?.scrollTo({top: 0});
              } else {
                scrollListToEnd();
              }
            }}
          />
        ) : (
          <Button
            onClick={openAddTaskForm}
            className="w-full"
            type="button"
            variant="secondary"
            ref={addTaskButtonRef}
            disabled={props.readonly}
            title="Press 't' to add a task"
          >
            + Add a task
          </Button>
        )}
      </div>
    </div>
  );
}
