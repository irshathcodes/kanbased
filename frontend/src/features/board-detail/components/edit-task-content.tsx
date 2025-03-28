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
import { ArrowLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QueryKey, useQueryClient } from "@tanstack/react-query";

export default function EditTaskContent(props: {
  defaultContent: string;
  editorRef: CodeMirrorEditorRef;
  taskId: string;
  afterSave: () => void;
  exitEditorWithoutSaving: () => void;
  taskDetailQueryKey: QueryKey;
}) {
  const [isDirty, setIsDirty] = useState(false);
  const queryClient = useQueryClient();

  const updateContentMutation = api.useMutation(
    "patch",
    "/api/v1/tasks/{taskId}",
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: props.taskDetailQueryKey,
        });

        toast.success("Task updated");
        props.afterSave();
      },
    },
  );

  const {
    parsedHtml,
    mode,
    handleModeChange,
    toggleModeKey,
    editorMode,
    setEditorMode,
  } = useMarkdownEditorPreviewToggle({
    defaultContent: props.defaultContent,
    editorRef: props.editorRef,
    isDirty,
  });

  const content = useRef(props.defaultContent);

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
    updateContentMutation.mutate({
      body: {
        updatedAt: new Date().toISOString(),
        content: props.editorRef.current?.getData(),
      },
      params: {
        path: {
          taskId: props.taskId,
        },
      },
    });
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
                  <ArrowLeft />
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
              disabled={updateContentMutation.isPending || !isDirty}
            >
              {updateContentMutation.isPending ? (
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
