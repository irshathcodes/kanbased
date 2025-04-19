import { KeyboardShortcutIndicator } from "@/components/keyboard-shortcut";
import { buttonVariants } from "@/components/ui/button";
import { markdownToHtml } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { GetNoteQueryResult } from "@/lib/zero-queries";

export function ViewNote(props: {
  note: NonNullable<GetNoteQueryResult>;
  wrapperClassName?: string;
  isEditing: boolean;
}) {
  const router = useRouter();

  const html = useMemo(
    () => markdownToHtml(props.note.content),
    [props.note.content],
  );

  useEffect(() => {
    if (props.isEditing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "e") {
        e.preventDefault();
        router.navigate({ to: ".", search: { editNoteId: props.note.id } });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [props.isEditing]);

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-8",
        props.wrapperClassName,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{props.note.name}</h1>

        <Link
          to="."
          search={{ editNoteId: props.note.id }}
          className={buttonVariants({ size: "sm" })}
          replace
          id="edit-note-button"
        >
          Edit
          <KeyboardShortcutIndicator>E</KeyboardShortcutIndicator>
        </Link>
      </div>

      <div className="flex-1 h-full overflow-y-auto">
        <div className="max-w-[1000px] mx-auto">
          <div
            className={cn(
              "prose dark:prose-invert h-full max-w-none",
              props.wrapperClassName,
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </div>
      </div>
    </div>
  );
}
