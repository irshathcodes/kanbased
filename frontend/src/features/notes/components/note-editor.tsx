import { useRef, useState } from "react";
import {
  CodeMirrorEditorRef,
  EditorMode,
} from "@/components/md-editor/md-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarkdownEditorPreviewToggle } from "@/hooks/use-markdown-editor";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/openapi-react-query";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { KeyboardShortcutIndicator } from "@/components/keyboard-shortcut";
import MdPreview from "@/components/md-preview/md-preview";
import CodeMirrorEditor from "@/components/md-editor/md-editor";
import { useKeyDown } from "@/hooks/use-keydown";
import { Undo2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { getId } from "@/lib/utils";
import { flushSync } from "react-dom";

type NoteEditorProps =
  | {
      defaultContent: string;
      editorRef: CodeMirrorEditorRef;
      mode: "edit";
      exitEditorWithoutSaving: () => void;
      noteId: string;
      afterSave: (data: { noteId: string }) => void;
    }
  | {
      mode: "create";
      editorRef: CodeMirrorEditorRef;
      exitEditorWithoutSaving: () => void;
      afterSave: (data: { noteId: string }) => void;
    };

export default function NoteEditor(props: NoteEditorProps) {
  const [isDirty, setIsDirty] = useState(false);
  const queryClient = useQueryClient();
  const isCreate = props.mode === "create";

  const updateNoteMutation = api.useMutation(
    "patch",
    "/api/v1/notes/{noteId}",
    {
      onSuccess: async () => {
        // const queryKey = getNoteQueryOptions({ noteId: props.noteId }).queryKey;

        // await queryClient.invalidateQueries({
        //   queryKey: props.taskDetailQueryKey,
        // });

        flushSync(() => {
          setIsDirty(false);
        });

        toast.success("Note updated");
        const noteId = !isCreate ? props.noteId : undefined;
        props.afterSave({ noteId: noteId! });
      },
    }
  );

  const createNoteMutation = api.useMutation("post", "/api/v1/notes", {
    onSuccess: (data) => {
      flushSync(() => {
        setIsDirty(false);
      });

      toast.success("Note created");

      props.afterSave({ noteId: data.id });
    },
  });

  const defaultContent = isCreate ? "" : props.defaultContent;
  const isPending = isCreate
    ? createNoteMutation.isPending
    : updateNoteMutation.isPending;

  const {
    parsedHtml,
    mode,
    handleModeChange,
    toggleModeKey,
    editorMode,
    setEditorMode,
  } = useMarkdownEditorPreviewToggle({
    defaultContent,
    editorRef: props.editorRef,
    isDirty,
  });

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
      props.exitEditorWithoutSaving();
    }
  });

  const handleSave = () => {
    const now = new Date().toISOString();
    if (isCreate) {
      createNoteMutation.mutate({
        body: {
          content: content.current,
          name: "New Note",
          id: getId(),
          createdAt: now,
        },
      });
    } else {
      updateNoteMutation.mutate({
        body: {
          updatedAt: now,
          content: content.current,
          name: "New Note",
        },
        params: {
          path: {
            noteId: props.noteId,
          },
        },
      });
    }
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

            <KeyboardShortcutIndicator label="Toggle mode" commandOrCtrlKey>
              {toggleModeKey}
            </KeyboardShortcutIndicator>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-9"
                  onClick={props.exitEditorWithoutSaving}
                >
                  <Undo2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Exit editor mode with unsaved changes
                <KeyboardShortcutIndicator commandOrCtrlKey>
                  Shift E
                </KeyboardShortcutIndicator>
              </TooltipContent>
            </Tooltip>
            <Button
              onClick={handleSave}
              type="button"
              size="sm"
              className="flex items-center gap-2"
              disabled={isPending || !isDirty}
            >
              {isPending ? (
                <>
                  <Spinner className="mr-1" />
                  <span className="w-20">Saving...</span>
                </>
              ) : (
                <>
                  <span>Save</span>
                  <KeyboardShortcutIndicator commandOrCtrlKey>
                    S
                  </KeyboardShortcutIndicator>
                </>
              )}
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
              defaultAutoFocus={mode === "write"}
              ref={props.editorRef}
              defaultContent={content.current}
              defaultMode={editorMode}
              onModeChange={handleEditorModeChange}
              onChange={handleContentChange}
              key={editorMode}
              onSave={handleSave}
              onExitEditorWithoutSaving={props.exitEditorWithoutSaving}
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
  );
}
