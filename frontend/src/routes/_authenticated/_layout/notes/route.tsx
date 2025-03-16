import { Button } from "@/components/ui/button";
import { CreateNoteButton } from "@/features/notes/components/create-note-button";
import { ModalProvider } from "@/state/modals";
import { createFileRoute, linkOptions } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_layout/notes")({
  component: RouteComponent,

  loader: () => {
    return {
      breadcrumbs: linkOptions([
        {
          label: "Notes",
          to: "/notes",
        },
      ]),
    };
  },

  validateSearch: (search): { createNote?: boolean } => {
    console.log(search);
    return {
      createNote:
        typeof search.createNote === "boolean" ? search.createNote : undefined,
    };
  },
});

function RouteComponent() {
  return (
    <ModalProvider>
      <div className="container mx-auto px-4 py-8 w-full">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Notes (0)</h1>
              <p className="text-muted-foreground mt-1">
                Manage and organize your boards
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button size="sm">Create Note</Button>
            </div>
          </div>

          {0 === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
              <h1 className="text-xl font-bold mb-1">No notes yet</h1>
              <p className="text-muted-foreground mb-4 text-sm">
                Create your first note to get started!
              </p>

              <CreateNoteButton size="sm" />
            </div>
          ) : // Notes list here.
          null}
        </div>
      </div>
    </ModalProvider>
  );
}
