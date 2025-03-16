import DOMPurify from "dompurify";
import { marked } from "marked";

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
      const column = columnWithTasksMap.get(task.columnId)!;
      columnWithTasksMap.set(column.id, {
        ...column,
        tasks: [...column.tasks, task],
      });
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

export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  const sanitizedContent = DOMPurify.sanitize(markdown);
  const escapedContent = sanitizedContent.replace(
    /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,
    ""
  );

  return marked.parse(escapedContent) as string;
}

export function removeUndefinedKeys<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
}

export function focusElementWithDelay(element: HTMLElement | null) {
  if (!element) return;

  setTimeout(() => {
    element.focus();
  }, 100);
}
