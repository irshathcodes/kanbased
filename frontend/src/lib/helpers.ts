import DOMPurify from "dompurify";
import { marked } from "marked";

import { sessionQueryOptions } from "@/lib/query-options-factory";
import { QueryClient } from "@tanstack/react-query";

export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  const sanitizedContent = DOMPurify.sanitize(markdown);
  const escapedContent = sanitizedContent.replace(
    /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,
    "",
  );

  return marked.parse(escapedContent) as string;
}

export function removeUndefinedKeys<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined),
  ) as Partial<T>;
}

export function focusElementWithDelay(element: HTMLElement | null) {
  if (!element) return;

  setTimeout(() => {
    element.focus();
  }, 100);
}

export function clearAndResetSessionQueryCache(queryClient: QueryClient) {
  return queryClient.resetQueries({
    queryKey: sessionQueryOptions.queryKey,
  });
}
