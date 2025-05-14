import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {useQuery} from "@rocicorp/zero/react";
import {useZ} from "@/lib/zero-cache";
import {getNoteQuery} from "@/lib/zero-queries";
import NoteEditor from "@/features/notes/note-editor";
import {focusElementWithDelay} from "@/lib/helpers";

export const Route = createFileRoute("/_authenticated/_layout/notes/$noteId")({
  component: RouteComponent,
});

function RouteComponent() {
  const {noteId} = Route.useParams();
  const z = useZ();
  const [note] = useQuery(getNoteQuery(z, noteId));
  const navigate = useNavigate();

  if (!note) {
    return null;
  }

  const goToNotes = () => {
    navigate({to: "/notes"}).then(() => {
      focusElementWithDelay(document.getElementById(`note-item-${noteId}`));
    });
  };

  return <NoteEditor note={note} onClose={goToNotes} mode="edit" />;
}
