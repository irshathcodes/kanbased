import { useIsMobile } from "@/hooks/use-mobile";
import { isMac } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function KeyboardShortcutIndicator(
  props: React.PropsWithChildren<{
    label?: string;
    commandOrCtrlKey?: boolean;
  }>,
) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  const commandOrCtrlLabel = props.commandOrCtrlKey && (
    <span className={cn(isMac && "text-base")}>{isMac ? "⌘" : "Ctrl"}</span>
  );

  if (props.label) {
    return (
      <div className="flex items-center text-xs text-muted-foreground rounded px-1 w-fit h-fit self-center shrink-0">
        <span>{props.label}: </span>
        <kbd className="inline-flex ml-1 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono font-medium uppercase">
          {commandOrCtrlLabel}
          {props.children}
        </kbd>
      </div>
    );
  }

  return (
    <kbd className="inline-flex ml-1 select-none items-center gap-1 rounded border px-1.5 font-mono uppercase font-medium text-[0.625rem]">
      {commandOrCtrlLabel}
      {props.children}
    </kbd>
  );
}
