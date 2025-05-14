import {lazy, Suspense, useRef, useState} from "react";
import {toast} from "sonner";
import {flushSync} from "react-dom";
import {
  EllipsisVertical,
  Expand,
  Info,
  Minimize2,
  Save,
  Trash2,
} from "lucide-react";
import {useHotkeys} from "react-hotkeys-hook";
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
import {GetNoteQueryResult} from "@/lib/zero-queries";
import {MilkdownEditorRef} from "@/components/md-editor/markdown-editor";
import {useDirtyEditorBlock} from "@/hooks/use-dirty-editor-block";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MarkdownEditorLazy = lazy(
  () => import("@/components/md-editor/markdown-editor"),
);

type CreateNoteProps = {
  mode: "create";
  onClose: () => void;
  afterSave: (noteId: string) => void;
};

type EditNoteProps = {
  mode: "edit";
  note: NonNullable<GetNoteQueryResult>;
  onClose: () => void;
};

type NoteEditorProps = CreateNoteProps | EditNoteProps;

export default function NoteEditor(props: NoteEditorProps) {
  const isCreate = props.mode === "create";
  const z = useZ();
  const editorRef = useRef<MilkdownEditorRef>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [hasFocused, setHasFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeOrganizationId = useActiveOrganizationId();
  const defaultTitle = isCreate ? "Untitled Note" : (props.note?.name ?? "");
  const [title, setTitle] = useState(defaultTitle);
  const [isFullscreen, setIsFullscreen] = useLocalStorage(
    "note-editor-fullscreen",
    false,
  );

  useHotkeys(
    "f",
    () => {
      editorRef.current?.focus();
    },
    {preventDefault: true},
  );

  useHotkeys("Escape", () => props.onClose(), {enableOnContentEditable: true});

  useHotkeys("mod+s", () => handleSave(), [isDirty], {
    preventDefault: true,
    enableOnContentEditable: true,
  });

  useDirtyEditorBlock(isDirty);

  const handleSave = () => {
    const noteId = isCreate ? createId() : props.note.id;
    const now = Date.now();

    z.mutate.notesTable.upsert({
      id: noteId,
      name: title,
      content: editorRef.current!.getMarkdown(),
      createdAt: now,
      updatedAt: isCreate ? null : now,
      organizationId: activeOrganizationId,
      creatorId: z.userID,
    });

    flushSync(() => {
      setIsDirty(false);
    });

    toast.success(isCreate ? "Note created" : "Note updated");
    isCreate && props.afterSave(noteId);
  };

  const handleDelete = async () => {
    if (!isCreate) {
      await z.mutate.notesTable.update({
        id: props.note.id,
        deletedAt: Date.now(),
      });
    }

    toast.success("Note deleted");
    props.onClose();
  };

  const handleTitleSave = (updatedTitle: string) => {
    setTitle(updatedTitle);

    if (isCreate) {
      editorRef.current?.focus();
    } else {
      z.mutate.notesTable.update({
        id: props.note.id,
        name: updatedTitle,
      });
    }
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
              defaultMode={isCreate ? "edit" : "view"}
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
              disabled={!isDirty}
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

        <div className="ml-auto shrink-0 flex items-center gap-3">
          {!isFullscreen && (
            <Button
              onClick={handleSave}
              type="button"
              size="sm"
              className={cn(
                "h-9 transition-opacity duration-300",
                isDirty && !isFullscreen
                  ? "visible opacity-100"
                  : "invisible opacity-0",
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

          {!isCreate && !isFullscreen && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="size-8">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
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

        <div className="overflow-y-auto" ref={containerRef}>
          <div className="min-h-0 flex-1 h-full mx-auto w-full md:w-4xl flex justify-center *:w-full">
            {isCreate || props.note !== undefined ? (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center gap-2">
                    <Spinner />
                    Loading editor...
                  </div>
                }
              >
                <MarkdownEditorLazy
                  defaultValue={isCreate ? "" : (props.note.content ?? "")}
                  ref={editorRef}
                  onChange={() => {
                    setIsDirty(true);
                  }}
                  onFocus={() => {
                    containerRef.current?.scrollTo({
                      top: containerRef.current.scrollHeight,
                    });
                    setHasFocused(true);
                  }}
                  key={isCreate ? "create" : props.note.id}
                />
              </Suspense>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
