import { getRouteApi, useRouter } from "@tanstack/react-router";
import NoteEditor from "@/features/notes/components/note-editor";
import { NoteListResponse } from "@/types/api-response-types";

const routeApi = getRouteApi("/_authenticated/_layout/notes_/$noteId");

export function Actions(props: { note: NoteListResponse["notes"][number] }) {
  const router = useRouter();
  const { editNoteId } = routeApi.useSearch();

  if (!editNoteId) return null;

  const clearParams = () => {
    router.navigate({ to: ".", search: undefined });
  };

  if (editNoteId) {
    return (
      <NoteEditor
        mode="edit"
        noteId={editNoteId}
        content={props.note.content}
        title={props.note.name}
        exitEditorWithoutSaving={clearParams}
        afterSave={clearParams}
        onClose={clearParams}
      />
    );
  }

  return null;
}
