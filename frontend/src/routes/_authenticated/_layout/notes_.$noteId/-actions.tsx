import { getRouteApi, useRouter } from "@tanstack/react-router";
import NoteEditor from "@/features/notes/components/note-editor";
import { focusElementWithDelay } from "@/lib/helpers";
import { GetNoteQueryResult } from "@/lib/zero-queries";

const routeApi = getRouteApi("/_authenticated/_layout/notes_/$noteId");

export function Actions(props: { note: NonNullable<GetNoteQueryResult> }) {
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
