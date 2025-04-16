import { useRef, Suspense, lazy, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getTaskQuery } from "@/lib/zero-queries";
import { useQuery } from "@rocicorp/zero/react";
import { CodeMirrorEditorRefData } from "@/components/md-editor/md-editor";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useZ } from "@/lib/zero-cache";

const EditTaskContentLazy = lazy(
  () => import("@/features/board-detail/components/edit-task-content"),
);

const ViewTaskContentLazy = lazy(
  () => import("@/features/board-detail/components/view-task-content"),
);

export function TaskDetail(props: { onClose: () => void; taskId: string }) {
  const z = useZ();
  const [data, taskQueryDetail] = useQuery(getTaskQuery(z, props.taskId));

  const editorRef = useRef<CodeMirrorEditorRefData>(null);
  const [isEditing, setIsEditing] = useState(false);

  const isTaskContentLoading = taskQueryDetail.type !== "complete";

  const editorLoading = (
    <div className="w-full h-full flex items-center justify-center gap-2">
      <Spinner />
      Loading editor...
    </div>
  );

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          const vimMode = editorRef.current?.getVimMode();

          // Always prevent Dialog from closing on Escape
          e.preventDefault();

          if (!vimMode) {
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
        <>
          <DialogHeader className="shrink-0">
            <DialogTitle>{data?.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Task detail for {data?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 h-full">
            {!isEditing && (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="w-full h-full" />
                  </div>
                }
              >
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center",
                    !isTaskContentLoading && "hidden",
                  )}
                >
                  <Skeleton className="w-full h-full" />
                </div>

                <ViewTaskContentLazy
                  content={data?.content ?? ""}
                  wrapperClassName={cn(isTaskContentLoading && "hidden")}
                  onEdit={() => setIsEditing(true)}
                />
              </Suspense>
            )}

            {isEditing &&
              (isTaskContentLoading ? (
                editorLoading
              ) : !isTaskContentLoading && data !== undefined ? (
                <Suspense fallback={editorLoading}>
                  <EditTaskContentLazy
                    defaultContent={data.content ?? ""}
                    editorRef={editorRef}
                    taskId={props.taskId}
                    afterSave={() => {
                      setIsEditing(false);
                    }}
                    exitEditorWithoutSaving={() => setIsEditing(false)}
                  />
                </Suspense>
              ) : null)}
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
