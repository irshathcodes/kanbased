import {getRouteApi, useNavigate} from "@tanstack/react-router";
import {focusElementWithDelay} from "@/lib/helpers";
import NoteEditor from "@/features/notes/note-editor";

const routeApi = getRouteApi("/_authenticated/_layout/notes");

export function Actions() {
  const {createNote} = routeApi.useSearch();
  const navigate = useNavigate();

  if (createNote) {
    return (
      <NoteEditor
        mode="create"
        afterSave={(noteId) => {
          navigate({
            to: "/notes/$noteId",
            params: {noteId},
            search: undefined,
            replace: true,
          });
        }}
        onClose={() => {
          navigate({to: ".", search: undefined, replace: true});
          focusElementWithDelay(document.getElementById("create-note-button"));
        }}
      />
    );
  }

  return null;
}
