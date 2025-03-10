import { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { taskDetailQueryOptions } from "@/lib/query-options-factory";
import { FullScreenError } from "@/components/errors";
import {
  CodeMirrorEditorRef,
  CodeMirrorEditorRefData,
  EditorMode,
} from "@/components/md-editor/md-editor";
import CodeMirrorEditor from "@/components/md-editor/md-editor";
import MdPreview from "@/components/md-preview/md-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarkdownEditorPreviewToggle } from "@/hooks/use-markdown-editor";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/openapi-react-query";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { KeyboardShortcutIndicator } from "@/components/keyboard-shortcut";
import { ctrlKeyLabel } from "@/lib/constants";
import { useBlocker } from "@tanstack/react-router";

export function TaskDetail(props: {
  onClose: () => void;
  taskId: string;
  columnsQueryKey: QueryKey;
}) {
  const taskDetailQueryOpt = taskDetailQueryOptions({
    taskId: props.taskId,
    columnsQueryKey: props.columnsQueryKey,
  });

  const { data, isFetching, error, isError } = useQuery(taskDetailQueryOpt);
  const editorRef = useRef<CodeMirrorEditorRefData>(null);

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent
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
        {isError ? (
          <FullScreenError
            title="Error loading task"
            message={error?.message}
          />
        ) : (
          <>
            <DialogHeader className="shrink-0">
              <DialogTitle>{data?.name}</DialogTitle>
              <DialogDescription className="sr-only">
                Task detail for {data?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 h-full mt-4">
              <div className="w-full h-full relative min-h-0 border rounded-lg">
                {isFetching ? (
                  <div className="w-full h-full flex items-center justify-center gap-2">
                    <Spinner /> <span>Getting task details...</span>
                  </div>
                ) : data && !isFetching ? (
                  <EditTaskContent
                    defaultContent={data.content ?? ""}
                    editorRef={editorRef}
                    taskId={props.taskId}
                    onClose={props.onClose}
                  />
                ) : null}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditTaskContent(props: {
  defaultContent: string;
  editorRef: CodeMirrorEditorRef;
  taskId: string;
  onClose: () => void;
}) {
  const [isDirty, setIsDirty] = useState(false);

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const updateContentMutation = api.useMutation(
    "patch",
    "/api/v1/tasks/{taskId}",
    {
      onSuccess: () => {
        // TODO: need to invalidate the query here, will do that later.
      },
    }
  );

  const {
    parsedHtml,
    mode,
    handleModeChange,
    toggleModeShortcutKey,
    editorMode,
    setEditorMode,
  } = useMarkdownEditorPreviewToggle({
    defaultContent: props.defaultContent,
    editorRef: props.editorRef,
  });

  const content = useRef(props.defaultContent);

  const handleSave = (closeAfterSave: boolean = false) => {
    updateContentMutation.mutate(
      {
        body: {
          updatedAt: new Date().toISOString(),
          content: props.editorRef.current?.getData(),
        },
        params: {
          path: {
            taskId: props.taskId,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Task updated");
          if (closeAfterSave) {
            props.onClose();
          }
        },
      }
    );
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
    <Tabs
      className="w-full h-full flex flex-col"
      value={mode}
      onValueChange={(value) => handleModeChange(value as "write" | "preview")}
    >
      <div className="flex shrink-0 justify-between">
        <div className="flex items-center gap-2">
          <TabsList className="shrink-0 self-start flex items-center gap-2">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <KeyboardShortcutIndicator label="Toggle">
            {toggleModeShortcutKey}
          </KeyboardShortcutIndicator>
        </div>

        <div className="pr-1.5 pt-1.5">
          <Button
            onClick={() => handleSave(false)}
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
                <KeyboardShortcutIndicator>
                  {ctrlKeyLabel} + S
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
            onSave={() => handleSave(false)}
            onSaveAndQuit={() => handleSave(true)}
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
  );
}
