import { focusElementWithDelay } from "@/lib/helpers";
import { useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import NoteEditor from "@/features/notes/components/note-editor";
const routeApi = getRouteApi("/_authenticated/_layout/notes");

export function Actions() {
  const router = useRouter();
  const { createNote } = routeApi.useSearch();

  const handleClose = () => {
    router.navigate({ to: ".", search: undefined });
    focusElementWithDelay(document.getElementById("create-note-button"));
  };

  if (createNote) {
    return (
      <NoteEditor
        mode="create"
        exitEditorWithoutSaving={handleClose}
        onClose={handleClose}
        afterSave={({ noteId }) => {
          router.navigate({
            to: "/notes/$noteId",
            params: { noteId },
            search: undefined,
            replace: true,
          });
        }}
      />
    );
  }

  return null;
}
