import {getRouteApi, useRouter} from "@tanstack/react-router";
import type {GetNoteQueryResult} from "@/lib/zero-queries";
import NoteEditor from "@/features/notes/note-editor";
import {focusElementWithDelay} from "@/lib/helpers";

const routeApi = getRouteApi("/_authenticated/_layout/notes_/$noteId");

export function Actions(props: {note: NonNullable<GetNoteQueryResult>}) {
  const router = useRouter();
  const {editNoteId, defaultTab} = routeApi.useSearch();

  const handleClose = () => {
    router.navigate({to: ".", search: undefined, replace: true});
    if (defaultTab !== "preview") {
      focusElementWithDelay(document.getElementById("edit-note-button"));
    } else {
      focusElementWithDelay(document.getElementById("preview-note-button"));
    }
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
        defaultTab={defaultTab}
      />
    );
  }

  return null;
}
