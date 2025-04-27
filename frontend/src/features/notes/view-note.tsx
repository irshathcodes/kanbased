import { KeyboardShortcutIndicator } from "@/components/keyboard-shortcut";
import { Button, buttonVariants } from "@/components/ui/button";
import { markdownToHtml } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { GetNoteQueryResult } from "@/lib/zero-queries";
import { WrappedTooltip } from "@/components/ui/tooltip";
import { Expand, EllipsisVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useZ } from "@/lib/zero-cache";
import { toast } from "sonner";

export function ViewNote(props: {
  note: NonNullable<GetNoteQueryResult>;
  wrapperClassName?: string;
  isEditing: boolean;
}) {
  const router = useRouter();
  const z = useZ();

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

  const handleDelete = async () => {
    await z.mutate.notesTable.update({
      id: props.note.id,
      deletedAt: Date.now(),
    });
    toast.success("Note deleted");
    router.navigate({ to: "/notes" });
  };

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-8",
        props.wrapperClassName,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{props.note.name}</h1>

        <div className="flex items-center gap-3">
          <WrappedTooltip tooltipContentProps={{ side: "bottom" }}>
            <Link
              to="."
              search={{ editNoteId: props.note.id, defaultTab: "preview" }}
              className={buttonVariants({ size: "icon", variant: "ghost" })}
              replace
              onClick={() => {
                localStorage.setItem("note-editor-fullscreen", "true");
              }}
              id="preview-note-button"
            >
              <Expand className="size-4" />
            </Link>

            <span>Enter Zen Mode</span>
          </WrappedTooltip>

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <EllipsisVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-10! focus:bg-red-3! dark:focus:bg-red-2!"
              >
                <Trash className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
