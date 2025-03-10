import { useRef, useState } from "react";
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
  CodeMirrorEditorRefData,
  EditorMode,
} from "@/components/md-editor/md-editor";
import CodeMirrorEditor from "@/components/md-editor/md-editor";
import MdPreview from "@/components/md-preview/md-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarkdownEditorPreviewToggle } from "@/hooks/use-markdown-editor";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { api } from "@/lib/openapi-react-query";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function TaskDetail(props: {
  onClose: () => void;
  taskId: string;
  columnsQueryKey: QueryKey;
}) {
  const taskDetailQueryOpt = taskDetailQueryOptions({
    taskId: props.taskId,
    columnsQueryKey: props.columnsQueryKey,
  });

  const { data, isPlaceholderData, isFetching, error, isError } =
    useQuery(taskDetailQueryOpt);
  const updateContentMutation = api.useMutation(
    "patch",
    "/api/v1/tasks/{taskId}",
    {
      onSuccess: () => {
        // TODO: need to invalidate the query here, will do that later.
      },
    }
  );

  const editorRef = useRef<CodeMirrorEditorRefData>(null);
  const [editorMode, setEditorMode] = useLocalStorage<EditorMode>(
    "preferred-editor-mode",
    "standard"
  );
  const defaultContent = data?.content ?? "";

  const { parsedHtml, mode, handleModeChange, toggleModeShortcutKey } =
    useMarkdownEditorPreviewToggle({
      defaultContent,
      editorRef,
    });

  const handleSave = () => {
    updateContentMutation.mutate(
      {
        body: {
          updatedAt: new Date().toISOString(),
          content: editorRef.current?.getData(),
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
        },
      }
    );
  };

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
                {isFetching || isPlaceholderData ? (
                  <div className="w-full h-full flex items-center justify-center gap-2">
                    <Spinner /> <span>Getting task details...</span>
                  </div>
                ) : (
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

                        <div className="flex items-center text-xs text-muted-foreground rounded px-1.5 py-1 w-fit h-fit self-center">
                          <span>Toggle: </span>
                          <kbd className="inline-flex ml-1 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono font-medium">
                            {toggleModeShortcutKey}
                          </kbd>
                        </div>
                      </div>

                      <div className="pr-1.5 pt-1.5">
                        <Button
                          onClick={handleSave}
                          type="button"
                          size="sm"
                          disabled={updateContentMutation.isPending}
                        >
                          {updateContentMutation.isPending ? (
                            <Spinner />
                          ) : (
                            <SaveIcon className="w-4 h-4" />
                          )}
                          Save
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
                          ref={editorRef}
                          defaultContent={defaultContent}
                          defaultMode={editorMode}
                          onModeChange={(mode) => setEditorMode(mode)}
                          key={editorMode}
                          onSave={handleSave}
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
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
