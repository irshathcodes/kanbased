import {
  createFileRoute,
  linkOptions,
  useRouter,
} from "@tanstack/react-router";
import { queryClient } from "@/lib/query-client";
import { getNoteQueryOptions } from "@/lib/query-options-factory";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ViewNote } from "@/features/notes/components/view-note";
import { Actions } from "./-actions";
import { getSession } from "@/queries/session";

export const Route = createFileRoute("/_authenticated/_layout/notes_/$noteId")({
  component: RouteComponent,

  loader: async (ctx) => {
    const orgId = getSession(queryClient).session.activeOrganizationId!;
    const noteQueryOptions = getNoteQueryOptions({
      noteId: ctx.params.noteId,
      orgId,
    });
    const note = await queryClient.ensureQueryData(noteQueryOptions);

    return {
      breadcrumbs: linkOptions([
        {
          label: "Notes",
          to: "/notes",
        },
        {
          label: note.name,
          to: "/notes/$noteId",
          params: { noteId: ctx.params.noteId },
        },
      ]),
      noteQueryOptions,
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
  const { noteQueryOptions } = Route.useLoaderData();
  const { editNoteId } = Route.useSearch();
  const { data } = useSuspenseQuery(noteQueryOptions);

  return (
    <div className="py-4 px-6">
      <ViewNote note={data} isEditing={!!editNoteId} />

      <Actions note={data} />
    </div>
  );
}
