import {Suspense, lazy, useRef, useState} from "react";
import {toast} from "sonner";
import {Copy, Expand, Info, Minimize2, Save} from "lucide-react";
import {useHotkeys} from "react-hotkeys-hook";
import {flushSync} from "react-dom";
import type {MilkdownEditorRef} from "@/components/md-editor/markdown-editor";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {KeyboardShortcutIndicator} from "@/components/keyboard-shortcut";
import {cn, createId} from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {EditableText} from "@/components/editable-text";
import {useZ} from "@/lib/zero-cache";
import {useActiveOrganizationId} from "@/queries/session";
import {WrappedTooltip} from "@/components/ui/tooltip";
import {useLocalStorage} from "@/hooks/use-local-storage";
import {useDirtyEditorBlock} from "@/hooks/use-dirty-editor-block";

const MarkdownEditorLazy = lazy(
  () => import("@/components/md-editor/markdown-editor"),
);

export default function CreateNote(props: {
  onClose: () => void;
  afterSave: (noteId: string) => void;
}) {
  const z = useZ();
  const editorRef = useRef<MilkdownEditorRef>(null);
  const [hasFocused, setHasFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeOrganizationId = useActiveOrganizationId();
  const defaultTitle = "Untitled Note";
  const [title, setTitle] = useState(defaultTitle);
  const [isFullscreen, setIsFullscreen] = useLocalStorage(
    "note-editor-fullscreen",
    false,
  );
  const defaultContent = "";
  const [noteSaved, setNoteSaved] = useState(false);

  useHotkeys(
    "f",
    () => {
      editorRef.current?.focus();
    },
    {preventDefault: true},
  );

  useHotkeys("Escape", () => props.onClose(), {enableOnContentEditable: true});

  useHotkeys("mod+s", () => handleSave(), {
    preventDefault: true,
    enableOnContentEditable: true,
  });

  const getIsDirty = () => {
    if (noteSaved) return false;
    if (editorRef.current == null) return false;

    return (
      defaultTitle !== title ||
      editorRef.current.getMarkdown() !== defaultContent
    );
  };

  useDirtyEditorBlock(() => {
    return getIsDirty();
  });

  const handleSave = () => {
    const noteId = createId();

    z.mutate.notesTable.insert({
      id: noteId,
      name: title,
      content: editorRef.current!.getMarkdown(),
      createdAt: Date.now(),
      organizationId: activeOrganizationId,
      creatorId: z.userID,
    });

    flushSync(() => {
      setNoteSaved(true);
    });

    toast.success("Note created");
    props.afterSave(noteId);
  };

  const handleTitleSave = (updatedTitle: string) => {
    setTitle(updatedTitle);
    editorRef.current?.focus();
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
              inputLabel="Title"
              fieldName="title"
              inputClassName="text-xl font-bold w-80"
              buttonClassName="text-xl font-bold"
              defaultValue={title}
              defaultMode="edit"
              onSubmit={handleTitleSave}
            />
          </DialogTitle>
          <DialogDescription className="sr-only">
            Note for {title}
          </DialogDescription>
        </DialogHeader>

        <div className="absolute right-10 top-1.5">
          <WrappedTooltip tooltipContentProps={{side: "bottom"}}>
            <Button
              onClick={handleSave}
              variant="ghost"
              size="icon"
              className={!isFullscreen ? "hidden" : ""}
            >
              <Save />
            </Button>

            <span>
              Save
              <KeyboardShortcutIndicator commandOrCtrlKey>
                S
              </KeyboardShortcutIndicator>
            </span>
          </WrappedTooltip>

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
            {!isFullscreen && (
              <Button
                onClick={handleSave}
                type="button"
                size="sm"
                className={cn(
                  "h-9 transition-opacity duration-300",
                  !isFullscreen ? "visible opacity-100" : "invisible opacity-0",
                )}
              >
                <>
                  <span>Save</span>
                  <KeyboardShortcutIndicator commandOrCtrlKey>
                    S
                  </KeyboardShortcutIndicator>
                </>
              </Button>
            )}

            <Button
              onClick={handleCopyMarkdown}
              variant="secondary"
              size="icon"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div
            className="overflow-y-auto flex-1"
            ref={containerRef}
            tabIndex={-1}
            onClick={(e) => {
              // Only focus if clicking outside the editor content area
              const editorElement = document.querySelector(".milkdown");
              if (editorElement && !editorElement.contains(e.target as Node)) {
                editorRef.current?.focus();
              }
            }}
          >
            <div className="min-h-0 flex-1 h-full mx-auto w-full max-w-3xl flex justify-center *:w-full *:h-full">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center gap-2">
                    <Spinner />
                    Loading editor...
                  </div>
                }
              >
                <MarkdownEditorLazy
                  defaultValue={defaultContent}
                  ref={editorRef}
                  onFocus={() => {
                    containerRef.current?.scrollTo({
                      top: containerRef.current.scrollHeight,
                    });
                    setHasFocused(true);
                  }}
                  placeholder="Enter note..."
                />
              </Suspense>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
