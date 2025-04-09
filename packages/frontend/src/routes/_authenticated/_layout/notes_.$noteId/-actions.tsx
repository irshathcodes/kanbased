import { getRouteApi, useRouter } from "@tanstack/react-router";
import NoteEditor from "@/features/notes/components/note-editor";
import { NoteResponse } from "@/types/api-response-types";
import { focusElementWithDelay } from "@/lib/helpers";

const routeApi = getRouteApi("/_authenticated/_layout/notes_/$noteId");

export function Actions(props: { note: NoteResponse }) {
  const router = useRouter();
  const { editNoteId } = routeApi.useSearch();

  const handleClose = () => {
    router.navigate({ to: ".", search: undefined, replace: true });
    focusElementWithDelay(document.getElementById("edit-note-button"));
  };

  if (editNoteId) {
    return (
      <NoteEditor
        mode="edit"
        noteId={editNoteId}
        content={props.note.content}
        title={props.note.name}
        afterSave={handleClose}
        onClose={handleClose}
      />
    );
  }

  return null;
}
