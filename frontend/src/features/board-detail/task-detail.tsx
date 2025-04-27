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
import { useZ } from "@/lib/zero-cache";
import { EditableText } from "@/components/editable-text";

const EditTaskContentLazy = lazy(
  () => import("@/features/board-detail/edit-task-content"),
);

const ViewTaskContentLazy = lazy(
  () => import("@/features/board-detail/view-task-content"),
);

export function TaskDetail(props: { onClose: () => void; taskId: string }) {
  const editorRef = useRef<CodeMirrorEditorRefData>(null);
  const [isEditing, setIsEditing] = useState(false);

  const z = useZ();
  const [data] = useQuery(getTaskQuery(z, props.taskId));

  const handleTitleChange = (updatedTitle: string) => {
    z.mutate.tasksTable.update({
      id: data!.id,
      name: updatedTitle,
    });
  };

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const closeButton = document.querySelector("#dialog-close-button");
          (closeButton as HTMLElement)?.focus();
        }}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          const vimMode = editorRef.current?.getVimMode();

          if (e.defaultPrevented) {
            e.preventDefault();
            return;
          }

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
          <DialogHeader className="w-9/12">
            <DialogTitle>
              <EditableText
                inputLabel="Task Name"
                fieldName="name"
                inputClassName="text-xl font-bold w-full"
                buttonClassName="text-xl font-bold"
                defaultValue={data?.name ?? ""}
                defaultMode="view"
                onSubmit={handleTitleChange}
              />
            </DialogTitle>
            <DialogDescription className="sr-only">
              Task detail for {data?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 h-full">
            {!isEditing && (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <Spinner size="md" />
                  </div>
                }
              >
                <ViewTaskContentLazy
                  content={data?.content ?? ""}
                  onEdit={() => setIsEditing(true)}
                />
              </Suspense>
            )}

            {isEditing && (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center gap-2">
                    <Spinner />
                    Loading editor...
                  </div>
                }
              >
                {data !== undefined && (
                  <EditTaskContentLazy
                    defaultContent={data.content ?? ""}
                    editorRef={editorRef}
                    taskId={props.taskId}
                    afterSave={() => {
                      setIsEditing(false);
                    }}
                    exitEditorWithoutSaving={() => setIsEditing(false)}
                  />
                )}
              </Suspense>
            )}
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
