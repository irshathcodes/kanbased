import NoteEditor from "@/features/notes/components/note-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { CodeMirrorEditorRefData } from "@/components/md-editor/md-editor";

export function CreateNote(props: {
  onClose: () => void;
  afterSave: (data: { noteId: string }) => void;
}) {
  const editorRef = useRef<CodeMirrorEditorRefData>(null);

  return (
    <Dialog open onOpenChange={props.onClose}>
      <DialogContent
        // onCloseAutoFocus={(e) => e.preventDefault()}
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
        <>
          <DialogHeader className="shrink-0">
            <DialogTitle>Create Note</DialogTitle>
            <DialogDescription className="sr-only">
              Create Note
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 h-full">
            <NoteEditor
              exitEditorWithoutSaving={props.onClose}
              afterSave={props.afterSave}
              editorRef={editorRef}
              mode="create"
            />
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
