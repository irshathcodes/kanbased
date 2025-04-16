import { useRef, useState } from "react";
import {
  CodeMirrorEditorRefData,
  EditorMode,
} from "@/components/md-editor/md-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarkdownEditorPreviewToggle } from "@/hooks/use-markdown-editor";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { KeyboardShortcutIndicator } from "@/components/keyboard-shortcut";
import MdPreview from "@/components/md-preview/md-preview";
import CodeMirrorEditor from "@/components/md-editor/md-editor";
import { useKeyDown } from "@/hooks/use-keydown";
import { createId } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Suspense } from "react";
import { EditableText } from "@/components/editable-text";
import { useZ } from "@/lib/zero-cache";
import { flushSync } from "react-dom";
import { useActiveOrganizationId } from "@/queries/session";
type CommonProps = {
  afterSave: (data: { noteId: string }) => void;
  onClose: () => void;
};

type NoteEditorProps =
  | ({
      content: string;
      title: string;
      mode: "edit";
      noteId: string;
    } & CommonProps)
  | ({
      mode: "create";
    } & CommonProps);

export default function NoteEditor(props: NoteEditorProps) {
  const [isDirty, setIsDirty] = useState(false);
  const isCreate = props.mode === "create";
  const editorRef = useRef<CodeMirrorEditorRefData>(null);
  const z = useZ();

  const defaultTitle = isCreate ? "Untitled Note" : props.title;
  const defaultContent = isCreate ? "" : props.content;

  const {
    parsedHtml,
    mode,
    handleModeChange,
    toggleModeKey,
    editorMode,
    setEditorMode,
  } = useMarkdownEditorPreviewToggle({
    defaultContent,
    editorRef,
    isDirty,
  });

  const activeOrganizationId = useActiveOrganizationId();
  const [title, setTitle] = useState(defaultTitle);
  const content = useRef(defaultContent);

  useKeyDown((e) => {
    const isCtrlKey = e.metaKey || e.ctrlKey;
    if (isCtrlKey && e.key === "s") {
      e.preventDefault();
      if (!isDirty) return;

      handleSave();
    }

    if (isCtrlKey && e.shiftKey && e.key === "e") {
      e.preventDefault();
      props.onClose();
    }
  });

  const handleSave = () => {
    const noteId = isCreate ? createId() : props.noteId;
    const now = Date.now();

    z.mutate.notesTable.upsert({
      id: noteId,
      name: title,
      content: content.current,
      createdAt: now,
      updatedAt: isCreate ? null : now,
      organizationId: activeOrganizationId,
      creatorId: z.userID,
    });

    flushSync(() => {
      setIsDirty(false);
    });

    toast.success(isCreate ? "Note created" : "Note updated");
    props.afterSave({ noteId });
  };

  const handleEditorModeChange = (mode: EditorMode) => {
    setEditorMode(mode);

    toast.info(`Editor mode changed to ${mode}`, {
      position: "bottom-center",
    });
  };

  const handleContentChange = (value: string) => {
    content.current = value;
    setIsDirty(true);
  };

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          const vimMode = editorRef.current?.getVimMode();

          // Always prevent Dialog from closing on Escape
          e.preventDefault();

          if (!vimMode || vimMode === "normal") {
            props.onClose();
          } else {
            // the prevent default is to prevent the dialog from closing
            // but codemirror vim mode checking defaultPrevented for escape which is not what we want
            // so we are manually handling the escape for vim
            editorRef.current?.handleEscapeForVim();
          }
        }}
        className="min-w-[90%] h-[90%] flex flex-col"
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="max-w-80 w-full">
            <EditableText
              defaultEdit={isCreate}
              inputLabel="Title"
              fieldName="title"
              value={title}
              inputClassName="text-xl font-bold"
              buttonClassName="text-xl font-bold"
              buttonLabel="Edit title"
              onSubmit={(value) => {
                setTitle(value);
                setIsDirty(true);
              }}
            />
          </DialogTitle>
          <DialogDescription className="sr-only">Create Note</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 h-full">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center gap-2">
                <Spinner />
                Loading editor...
              </div>
            }
          >
            <div className="w-full h-full relative min-h-0">
              <Tabs
                className="w-full h-full flex flex-col"
                value={mode}
                onValueChange={(value) =>
                  handleModeChange(value as "write" | "preview")
                }
              >
                <div className="flex shrink-0 justify-between">
                  <div className="flex items-center gap-2">
                    <TabsList className="shrink-0 self-start flex items-center gap-2">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <KeyboardShortcutIndicator
                      label="Toggle mode"
                      commandOrCtrlKey
                    >
                      {toggleModeKey}
                    </KeyboardShortcutIndicator>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleSave}
                      type="button"
                      size="sm"
                      className="flex items-center gap-2"
                      disabled={!isDirty}
                    >
                      <>
                        <span>Save</span>
                        <KeyboardShortcutIndicator commandOrCtrlKey>
                          S
                        </KeyboardShortcutIndicator>
                      </>
                    </Button>
                  </div>
                </div>
                <TabsContent
                  value="write"
                  className="h-full flex-1 data-[state=inactive]:hidden min-h-0"
                  forceMount
                >
                  <div className="min-h-0 h-full">
                    <CodeMirrorEditor
                      ref={editorRef}
                      defaultContent={content.current}
                      defaultMode={editorMode}
                      defaultAutoFocus={!isCreate}
                      onModeChange={handleEditorModeChange}
                      onChange={handleContentChange}
                      key={editorMode}
                      onSave={handleSave}
                      onExitEditorWithoutSaving={props.onClose}
                      placeholder="Write your note here. The first line will be used as the title"
                    />
                  </div>
                </TabsContent>

                <TabsContent
                  value="preview"
                  className="h-full w-full flex-1 min-h-0 data-[state=inactive]:hidden"
                  forceMount
                >
                  <MdPreview
                    html={parsedHtml}
                    wrapperClassName="max-w-[1000px] mx-auto"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
}
