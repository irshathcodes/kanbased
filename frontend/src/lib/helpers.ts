import DOMPurify from "dompurify";
import { marked } from "marked";

export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  const sanitizedContent = DOMPurify.sanitize(markdown);
  const escapedContent = sanitizedContent.replace(
    /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,
    "",
  );

  return marked.parse(escapedContent) as string;
}

export function focusElementWithDelay(element: HTMLElement | null) {
  if (!element) return;

  setTimeout(() => {
    element.focus();
  }, 100);
}
