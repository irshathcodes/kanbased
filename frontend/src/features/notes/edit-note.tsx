import {Suspense, lazy, useRef, useState} from "react";
import {toast} from "sonner";
import {
  Copy,
  EllipsisVertical,
  Expand,
  Info,
  Minimize2,
  Trash2,
} from "lucide-react";
import {useHotkeys} from "react-hotkeys-hook";
import type {GetNoteQueryResult} from "@/lib/zero-queries";
import type {MilkdownEditorRef} from "@/components/md-editor/markdown-editor";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {KeyboardShortcutIndicator} from "@/components/keyboard-shortcut";
import {cn} from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {EditableText} from "@/components/editable-text";
import {useZ} from "@/lib/zero-cache";
import {useAuthData} from "@/queries/session";
import {WrappedTooltip} from "@/components/ui/tooltip";
import {useLocalStorage} from "@/hooks/use-local-storage";
import {useDirtyEditorBlock} from "@/hooks/use-dirty-editor-block";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Editor from "@/components/editor";
import type {EditorRef} from "@/components/editor";

const MarkdownEditorLazy = lazy(
  () => import("@/components/md-editor/markdown-editor"),
);

export default function EditNote(props: {
  note: NonNullable<GetNoteQueryResult>;
  onClose: () => void;
}) {
  const z = useZ();
  const editorRef = useRef<EditorRef>(null);
  const [hasFocused, setHasFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useLocalStorage(
    "note-editor-fullscreen",
    false,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const userData = useAuthData();
  const defaultTitle = props.note.name;
  const [title, setTitle] = useState(defaultTitle);
  const defaultContent = props.note.content ?? "";
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const isMember = userData.role === "member";

  useHotkeys(
    "f",
    () => {
      editorRef.current?.focus();
    },
    {preventDefault: true},
  );

  useHotkeys("Escape", () => props.onClose(), {enableOnContentEditable: true});

  useHotkeys(
    "mod+s",
    () => {
      handleMarkdownSave(editorRef.current?.getMarkdown() ?? "");
      toast.success("Note saved");
    },
    {
      preventDefault: true,
      enableOnContentEditable: true,
    },
  );

  useDirtyEditorBlock(() => {
    const currentContent = editorRef.current?.getMarkdown();

    const hasChanges =
      currentContent !== undefined && currentContent !== defaultContent;

    console.log("currentContent", currentContent);

    if (hasChanges) {
      handleMarkdownSave(currentContent);
    }

    return false;
  });

  const handleMarkdownSave = (updatedMarkdown: string) => {
    const noteId = props.note.id;

    z.mutate.notesTable.update({
      id: noteId,
      content: updatedMarkdown ?? "",
      updatedAt: Date.now(),
    });
  };

  const handleDelete = async () => {
    await z.mutate.notesTable.update({
      id: props.note.id,
      deletedAt: Date.now(),
    });

    toast.success("Note deleted");
    props.onClose();
  };

  const handleTitleSave = (updatedTitle: string) => {
    setTitle(updatedTitle);

    z.mutate.notesTable.update({
      id: props.note.id,
      name: updatedTitle,
    });
  };

  const handleCopyMarkdown = () => {
    const markdownContent = editorRef.current?.getMarkdown() ?? "";
    // Clean the markdown by removing <br /> tags and other HTML tags
    const cleanMarkdown = markdownContent
      .replace(/<br\s*\/?>/gi, "\n") // Replace <br /> with actual line breaks
      .replace(/<[^>]*>/g, ""); // Remove any other HTML tags

    navigator.clipboard.writeText(cleanMarkdown);
    toast.success("Content copied to clipboard");
  };

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent
        className={cn(
          "flex flex-col",
          isFullscreen
            ? "min-w-full h-screen p-4 gap-0"
            : "min-w-11/12 h-11/12 gap-2",
        )}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const closeButton = document.querySelector("#dialog-close-button");
          (closeButton as HTMLElement | null)?.focus();
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          document.body.style.pointerEvents = "";
        }}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="min-w-80 max-w-fit">
            <EditableText
              defaultReadOnly={isMember}
              inputLabel="Title"
              fieldName="title"
              inputClassName="text-xl font-bold w-80"
              buttonClassName="text-xl font-bold"
              defaultValue={title}
              defaultMode="view"
              onSubmit={handleTitleSave}
            />
          </DialogTitle>
          <DialogDescription className="sr-only">
            Note for {title}
          </DialogDescription>
        </DialogHeader>

        <div className="absolute right-10 top-1.5">
          {isFullscreen ? (
            <WrappedTooltip tooltipContentProps={{side: "bottom"}}>
              <Button
                onClick={() => setIsFullscreen(false)}
                variant="ghost"
                size="icon"
              >
                <Minimize2 />
              </Button>

              <span>Exit Zen Mode</span>
            </WrappedTooltip>
          ) : (
            <WrappedTooltip tooltipContentProps={{side: "bottom"}}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(true)}
              >
                <Expand className="size-4" />
              </Button>

              <span>Toggle Zen Mode</span>
            </WrappedTooltip>
          )}
        </div>

        {!hasFocused && (
          <div className="absolute bottom-0 right-0 text-muted-foreground text-xs p-2 flex items-center gap-1">
            <Info className="w-4 h-4" />
            Pro tip: Press{" "}
            <KeyboardShortcutIndicator>f</KeyboardShortcutIndicator> to focus on
            the editor
          </div>
        )}

        <div className="flex-1 h-full flex flex-col min-h-0">
          <div className="ml-auto shrink-0 flex items-center gap-3">
            {!isFullscreen && !isMember && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="size-8">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyMarkdown}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy content as markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="!text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    Delete note
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="overflow-y-auto flex-1" ref={containerRef}>
            <div className="min-h-0 flex-1 h-full mx-auto w-full max-w-3xl flex justify-center *:w-full *:h-full">
              {props.note !== undefined ? (
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center gap-2">
                      <Spinner />
                      Loading editor...
                    </div>
                  }
                >
                  <Editor
                    defaultValue={defaultContent}
                    defaultReadOnly={isMember}
                    ref={editorRef}
                    onChange={(updatedMarkdown) => {
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                      }

                      timeoutRef.current = setTimeout(() => {
                        if (updatedMarkdown !== defaultContent) {
                          handleMarkdownSave(updatedMarkdown);
                        }
                      }, 2000);
                    }}
                    onFocus={() => {
                      containerRef.current?.scrollTo({
                        top: containerRef.current.scrollHeight,
                      });
                      setHasFocused(true);
                    }}
                    placeholder={
                      props.note.content
                        ? "Type / for commands"
                        : "Enter note..."
                    }
                    key={props.note.id}
                  />
                </Suspense>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
