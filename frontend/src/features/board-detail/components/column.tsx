import { ColumnWrapper } from "@/components/column-ui";
import { Draggable } from "@hello-pangea/dnd";
import { GripVertical, MoreVertical } from "lucide-react";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { EditableColumnName } from "@/features/board-detail/components/editable-column-name";
import { ColumnsWithTasksQueryData } from "@/features/board-detail/queries/columns";
import { Tasks } from "@/features/board-detail/components/tasks";
import { QueryKey } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteColumn } from "@/features/board-detail/components/delete-column";
import { GetBoardWithColumnsAndTasksQueryResult } from "@/lib/zero-queries";

type ColumnProps = {
  column: NonNullable<GetBoardWithColumnsAndTasksQueryResult>["columns"][number];
  index: number;
  columnRef?: (node: HTMLElement | null) => void;
};

export function Column({ column, index, columnRef }: ColumnProps) {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => {
        return (
          <ColumnWrapper
            ref={useCallback((node: HTMLElement | null) => {
              provided.innerRef(node);
              columnRef?.(node);
            }, [])}
            {...provided.draggableProps}
            id={`col-${column.id}`}
            className={cn(
              "mx-2",
              snapshot.isDragging && "!border-gray-10 !shadow-xl",
            )}
          >
            <div className="flex items-center justify-between shrink-0 pt-1">
              <div
                className="cursor-grab text-muted-foreground w-8 grid place-content-center h-8 hover:text-foreground shrink-0 hover:bg-gray-a-4 active:bg-gray-a-4 rounded-lg active:cursor-grabbing mr-1.5"
                {...provided.dragHandleProps}
              >
                <GripVertical size={16} />
              </div>

              <EditableColumnName
                columnName={column.name}
                columnId={column.id}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="text-muted-foreground w-8 grid place-content-center h-8 hover:text-foreground shrink-0 hover:bg-gray-a-4 active:bg-gray-a-4 rounded-lg ml-2"
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
            </div>

            <Tasks tasks={column.tasks} columnId={column.id} />
          </ColumnWrapper>
        );
      }}
    </Draggable>
  );
}
