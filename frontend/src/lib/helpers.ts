import { ColumnsWithTasksResponse } from "@/types/api-response-types";

export function transformColumnsQuery(data: ColumnsWithTasksResponse) {
  type ColumnWithTasks = (typeof data.columns)[number] & {
    tasks: typeof data.tasks;
  };
  const columnWithTasksMap = new Map<string, ColumnWithTasks>();

  for (let column of data.columns) {
    columnWithTasksMap.set(column.id, { ...column, tasks: [] });
  }

  for (let task of data.tasks) {
    if (columnWithTasksMap.has(task.columnId)) {
      const column = columnWithTasksMap.get(task.columnId)!
      columnWithTasksMap.set(column.id, {
        ...column,
        tasks: [...column.tasks, task],
      })
    }
  }

  return {
    boardId: data.boardId,
    boardName: data.boardName,
    columns: Array.from(columnWithTasksMap.values()).sort(
      (a, b) => a.position - b.position
    ),
  };
}