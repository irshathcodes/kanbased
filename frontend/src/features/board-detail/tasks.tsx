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

export type TasksRefValue = {
  openAddTaskFormAtEnd: () => void;
  openAddTaskFormAtStart: () => void;
};
export function Tasks(props: {
  tasks: NonNullable<GetBoardWithColumnsAndTasksQueryResult>["columns"][number]["tasks"];
  columnId: string;
  readonly?: boolean;
  ref: React.Ref<TasksRefValue>;
}) {
  const [showAddTask, setShowAddTask] = useState<"first" | "last" | false>(
    false,
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const addTaskButtonRef = useRef<HTMLButtonElement | null>(null);
  const sortedTasks = props.tasks;

  const scrollListToEnd = () => {
    containerRef.current?.scrollTo({top: containerRef.current.scrollHeight});
  };

  const scrollListToStart = () => {
    containerRef.current?.scrollTo({top: 0});
  };

  const openAddTaskFormAtEnd = () => {
    flushSync(() => {
      setShowAddTask("last");
    });
    scrollListToEnd();
  };

  const openAddTaskFormAtStart = () => {
    flushSync(() => {
      setShowAddTask("first");
    });
    scrollListToStart();
  };

  useImperativeHandle(props.ref, () => ({
    openAddTaskFormAtStart,
    openAddTaskFormAtEnd,
  }));

  const firstPosition = sortedTasks.length ? sortedTasks[0]!.position : 1000;
  const nextPosition = sortedTasks.length
    ? sortedTasks[sortedTasks.length - 1]!.position + 1
    : 1000;

  const createTaskElement = showAddTask ? (
    <CreateTask
      columnId={props.columnId}
      onComplete={() => {
        flushSync(() => {
          setShowAddTask(false);
        });

        addTaskButtonRef.current?.focus();
      }}
      onAdd={() => {
        if (showAddTask === "first") {
          containerRef.current?.scrollTo({top: 0});
        } else {
          scrollListToEnd();
        }
      }}
      insertPosition={
        showAddTask === "first" ? firstPosition - 1 : nextPosition
      }
    />
  ) : null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {showAddTask === "first" && (
        <div className="shrink-0 mx-2 mb-3">{createTaskElement}</div>
      )}
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
        {showAddTask === "last" && createTaskElement}

        {!showAddTask && (
          <Button
            onClick={openAddTaskFormAtEnd}
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
