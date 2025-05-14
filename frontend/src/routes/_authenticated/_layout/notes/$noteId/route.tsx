import {
  createFileRoute,
  linkOptions,
  useNavigate,
} from "@tanstack/react-router";
import {useQuery} from "@rocicorp/zero/react";
import {useEffect} from "react";
import {Actions} from "./-actions";
import {ViewNote} from "@/features/notes/view-note";
import {useZ} from "@/lib/zero-cache";
import {getNoteQuery} from "@/lib/zero-queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NoteEditor from "@/features/notes/note-editor";

export const Route = createFileRoute("/_authenticated/_layout/notes/$noteId")({
  component: RouteComponent,

  loader: (ctx) => {
    return {
      breadcrumbs: linkOptions([
        {
          label: "Notes",
          to: "/notes",
        },
        {
          // TODO: get note name
          label: "Note",
          to: "/notes/$noteId",
          params: {noteId: ctx.params.noteId},
        },
      ]),
    };
  },

  validateSearch: (
    search,
  ): {editNoteId?: string; defaultTab?: "write" | "preview"} => {
    return {
      editNoteId:
        typeof search.editNoteId === "string" ? search.editNoteId : undefined,
      defaultTab:
        typeof search.defaultTab === "string"
          ? (search.defaultTab as "write" | "preview")
          : undefined,
    };
  },
});

function RouteComponent() {
  const {editNoteId} = Route.useSearch();
  const {noteId} = Route.useParams();
  const z = useZ();
  const [note] = useQuery(getNoteQuery(z, noteId));
  const navigate = useNavigate();

  if (!note) {
    // TODO: Handle not found case
    return null;
  }

  const handleClose = () => {
    navigate({to: "/notes"});
  };

  return <NoteEditor note={note} onClose={handleClose} mode="edit" />;
}
