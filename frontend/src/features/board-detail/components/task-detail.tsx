import { useRef, Suspense, lazy, useState } from "react";
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
import { CodeMirrorEditorRefData } from "@/components/md-editor/md-editor";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useActiveOrganizationId } from "@/queries/session";

const EditTaskContentLazy = lazy(
  () => import("@/features/board-detail/components/edit-task-content"),
);

const ViewTaskContentLazy = lazy(
  () => import("@/features/board-detail/components/view-task-content"),
);

export function TaskDetail(props: {
  onClose: () => void;
  taskId: string;
  columnsQueryKey: QueryKey;
}) {
  const orgId = useActiveOrganizationId();
  const taskDetailQueryOpt = taskDetailQueryOptions({
    taskId: props.taskId,
    columnsQueryKey: props.columnsQueryKey,
    orgId,
  });

  const {
    data,
    isLoading,
    isPlaceholderData,
    error,
    isError,
    isFetchedAfterMount,
  } = useQuery(taskDetailQueryOpt);

  const editorRef = useRef<CodeMirrorEditorRefData>(null);
  const [isEditing, setIsEditing] = useState(false);

  const isTaskContentLoading = isLoading || isPlaceholderData;

  const loadingSkeleton = (
    <div className="w-full h-full flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  );

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

            <div className="min-h-0 flex-1 h-full">
              {!isEditing && (
                <Suspense fallback={loadingSkeleton}>
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
                (!isFetchedAfterMount ? (
                  editorLoading
                ) : isFetchedAfterMount && data !== undefined ? (
                  <Suspense fallback={editorLoading}>
                    <EditTaskContentLazy
                      defaultContent={data.content ?? ""}
                      editorRef={editorRef}
                      taskId={props.taskId}
                      afterSave={() => {
                        setIsEditing(false);
                      }}
                      exitEditorWithoutSaving={() => setIsEditing(false)}
                      taskDetailQueryKey={taskDetailQueryOpt.queryKey}
                    />
                  </Suspense>
                ) : null)}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
