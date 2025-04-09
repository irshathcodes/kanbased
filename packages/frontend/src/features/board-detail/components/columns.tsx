import { Column } from "@/features/board-detail/components/column";
import { useCallback, useRef } from "react";
import { CreateColumn } from "@/features/board-detail/components/create-column";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import {
  ColumnsWithTasksQueryData,
  useColumnsSuspenseQuery,
  useMoveColumnsMutation,
} from "@/features/board-detail/queries/columns";
import { useMoveTasksMutation } from "@/features/board-detail/queries/tasks";
import {
  useColumnModalControls,
  useColumnModalState,
} from "@/features/board-detail/state/column";
import { QueryKey } from "@tanstack/react-query";

export function Columns({
  boardUrl,
  columnsQueryKey,
}: {
  boardUrl: string;
  columnsQueryKey: QueryKey;
}) {
  const { data } = useColumnsSuspenseQuery({ boardUrl });
  const moveColumnsMutation = useMoveColumnsMutation({ columnsQueryKey });
  const moveTasksMutation = useMoveTasksMutation({ columnsQueryKey });
  const containerRef = useRef<HTMLDivElement>(null);
  const { closeModal } = useColumnModalControls();
  const columns = data.columns;

  const lastColumnRef = useCallback((node: HTMLElement | null) => {
    /*
     * This callback is used to scroll to the end of the container whenever a new column is added.
     *
     * React assigns and calls ref callbacks for child components before assigning refs for their parent components.
     * By leveraging this behavior, we can ensure this code runs after the child node is mounted.
     *
     * The cool thing about this is The container won't scroll on the initial mount of the app.
     * The reason is `containerRef` will be null on initial mount because child nodes refs will be called first
     */

    if (!node) return;
    containerRef.current?.scrollTo({
      left: containerRef.current!.scrollWidth,
    });
  }, []);

  const handleDragEnd: OnDragEndResponder = async (e) => {
    if (!e.destination) {
      return;
    }

    const { source, destination } = e;

    // Did not move anywhere.
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (e.type === "COLUMN") {
      const colCopy = [...columns];

      const [removedEl] = colCopy.splice(e.source.index, 1);
      colCopy.splice(e.destination.index, 0, removedEl!);

      const updatedColPositions = colCopy.map((col, index) => ({
        ...col,
        position: index + 1,
      }));

      moveColumnsMutation.mutate({
        body: updatedColPositions.map((col) => ({
          id: col.id,
          position: col.position,
        })),
      });

      return;
    }

    if (e.type === "TASK") {
      // task update logic here

      // Find the destination column
      const column = columns.find(
        (col) => col.id === e.destination!.droppableId,
      )!;

      // Sort tasks by position
      let orderedTasks = [...column.tasks]
        .sort((a, b) => a.position - b.position)
        .map((task) => ({
          id: task.id,
          position: task.position,
          columnId: task.columnId,
        }));

      const isDropOnSameColumn =
        e.source.droppableId === e.destination.droppableId;

      if (isDropOnSameColumn) {
        const [removedTask] = orderedTasks.splice(e.source.index, 1);
        orderedTasks.splice(e.destination.index, 0, removedTask!);
      } else {
        orderedTasks.splice(e.destination.index, 0, {
          id: e.draggableId,
          position: 0,
          columnId: e.destination.droppableId,
        });
      }

      orderedTasks = orderedTasks.map((task, i) => ({
        ...task,
        position: i + 1,
      }));

      moveTasksMutation.mutate({
        body: orderedTasks,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={false}
        isCombineEnabled={false}
      >
        {(provided) => {
          return (
            <div
              ref={containerRef}
              className="pb-8 h-full inline-flex px-8 space-x-4"
              {...provided.droppableProps}
            >
              <div className="flex h-full" ref={provided.innerRef}>
                {columns.map((column, i, arr) => (
                  <Column
                    column={column}
                    columnsQueryKey={columnsQueryKey}
                    columnRef={arr.length - 1 === i ? lastColumnRef : undefined}
                    index={i}
                    key={column.id}
                  />
                ))}
                {provided.placeholder}
              </div>

              <CreateColumnModalGate>
                <CreateColumn
                  data={{
                    boardId: data.boardId,
                    nextPosition:
                      (columns[columns.length - 1]?.position ?? 0) + 1,
                    columnsQueryKey,
                  }}
                  onClose={closeModal}
                />
              </CreateColumnModalGate>
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
}

function CreateColumnModalGate(props: React.PropsWithChildren) {
  const { activeModal } = useColumnModalState();

  if (activeModal?.type !== "create-column") {
    return null;
  }

  return props.children;
}
