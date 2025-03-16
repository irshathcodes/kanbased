import { KeyboardShortcutIndicator } from "@/components/keyboard-shortcut";
import { Button } from "@/components/ui/button";
import { useKeyDown } from "@/hooks/use-keydown";
import { markdownToHtml } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function ViewTaskContent(props: {
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
      <Button className="ml-auto shrink-0" size="sm" onClick={props.onEdit}>
        Edit
        <KeyboardShortcutIndicator>E</KeyboardShortcutIndicator>
      </Button>

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
