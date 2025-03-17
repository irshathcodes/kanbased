import { CreateNoteButton } from "@/features/notes/components/create-note-button";
import { ModalProvider } from "@/state/modals";
import {
  createFileRoute,
  linkOptions,
  useRouter,
} from "@tanstack/react-router";
import { Actions } from "./-actions";
import { queryClient } from "@/lib/query-client";
import { getAllNotesQueryOptions } from "@/lib/query-options-factory";
import { useSuspenseQuery } from "@tanstack/react-query";
import { NoteList } from "@/features/notes/components/note-list";

export const Route = createFileRoute("/_authenticated/_layout/notes")({
  component: RouteComponent,

  loader: async () => {
    await queryClient.ensureQueryData(getAllNotesQueryOptions);

    return {
      breadcrumbs: linkOptions([
        {
          label: "Notes",
          to: "/notes",
        },
      ]),
      notesQueryOptions: getAllNotesQueryOptions,
    };
  },

  validateSearch: (search): { createNote?: boolean } => {
    return {
      createNote:
        typeof search.createNote === "boolean" ? search.createNote : undefined,
    };
  },
});

function RouteComponent() {
  const router = useRouter();
  const { notesQueryOptions } = Route.useLoaderData();
  const { data } = useSuspenseQuery(notesQueryOptions);

  const handleCreateNote = () => {
    router.navigate({ to: ".", search: { createNote: true } });
  };

  return (
    <ModalProvider>
      <div className="container mx-auto px-4 py-8 w-full">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Notes ({data.notes.length})
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and organize your notes
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CreateNoteButton size="sm" onClick={handleCreateNote} />
            </div>
          </div>

          {data.notes.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
              <h1 className="text-xl font-bold mb-1">No notes yet</h1>
              <p className="text-muted-foreground mb-4 text-sm">
                Create your first note to get started!
              </p>

              <CreateNoteButton size="sm" onClick={handleCreateNote} />
            </div>
          ) : (
            <NoteList notes={data.notes} />
          )}
        </div>
      </div>

      <Actions />
    </ModalProvider>
  );
}
