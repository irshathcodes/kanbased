import { createFileRoute, linkOptions } from "@tanstack/react-router";
import { ViewNote } from "@/features/notes/components/view-note";
import { Actions } from "./-actions";
import { useZ } from "@/lib/zero-cache";
import { getNoteQuery } from "@/lib/zero-queries";
import { useQuery } from "@rocicorp/zero/react";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/_layout/notes_/$noteId")({
  component: RouteComponent,

  loader: async (ctx) => {
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
          params: { noteId: ctx.params.noteId },
        },
      ]),
    };
  },

  validateSearch: (search): { editNoteId?: string } => {
    return {
      editNoteId:
        typeof search.editNoteId === "string" ? search.editNoteId : undefined,
    };
  },
});

function RouteComponent() {
  const { editNoteId } = Route.useSearch();
  const { noteId } = Route.useParams();
  const z = useZ();
  const [note] = useQuery(getNoteQuery(z, noteId));

  useEffect(() => {}, [note]);

  if (!note) {
    // TODO: Handle not found case
    return null;
  }

  return (
    <div className="py-4 px-6">
      <ViewNote note={note} isEditing={!!editNoteId} />

      <Actions note={note} />
    </div>
  );
}
