import { KeyboardShortcutIndicator } from "@/components/keyboard-shortcut";
import { Button } from "@/components/ui/button";
import { useKeyDown } from "@/hooks/use-keydown";
import { markdownToHtml } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export function ViewNote(props: {
  name: string;
  content: string;
  wrapperClassName?: string;
  onEdit: () => void;
}) {
  const html = useMemo(() => markdownToHtml(props.content), [props.content]);

  useKeyDown((e) => {
    if (e.key === "e") {
      e.preventDefault();
      props.onEdit();
    }
  });

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-2",
        props.wrapperClassName
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{props.name}</h1>

        <Button className="shrink-0" size="sm" onClick={props.onEdit}>
          Edit
          <KeyboardShortcutIndicator>E</KeyboardShortcutIndicator>
        </Button>
      </div>

      <div className="flex-1 h-full overflow-y-auto">
        <div className="max-w-[1000px] mx-auto">
          <div
            className={cn(
              "prose dark:prose-invert h-full max-w-none",
              props.wrapperClassName
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </div>
      </div>
    </div>
  );
}
