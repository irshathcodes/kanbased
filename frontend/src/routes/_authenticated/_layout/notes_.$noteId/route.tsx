import { createFileRoute, linkOptions } from "@tanstack/react-router";
import { BreadcrumbsData } from "@/components/tsr-breadcrumbs";
import { queryClient } from "@/lib/query-client";
import { getNoteQueryOptions } from "@/lib/query-options-factory";
import { useSuspenseQuery } from "@tanstack/react-query";
import MdPreview from "@/components/md-preview/md-preview";
import { ViewNote } from "@/features/notes/components/view-note";

export const Route = createFileRoute("/_authenticated/_layout/notes_/$noteId")({
  component: RouteComponent,

  loader: async (ctx) => {
    const noteQueryOptions = getNoteQueryOptions({ noteId: ctx.params.noteId });
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
});

function RouteComponent() {
  const { noteQueryOptions } = Route.useLoaderData();
  const { data } = useSuspenseQuery(noteQueryOptions);

  return (
    <div className="py-4 px-6">
      <ViewNote name={data.name} content={data.content} onEdit={() => {}} />
    </div>
  );
}
