import {Link} from "@tanstack/react-router";
import {MoreHorizontal, Trash2} from "lucide-react";
import {toast} from "sonner";
import type {GetNotesListQueryResult} from "@/lib/zero-queries";
import {getRelativeTimeString} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useZ} from "@/lib/zero-cache";

function NoteItem({
  note,
  onDelete,
}: {
  note: GetNotesListQueryResult[number];
  onDelete: () => void;
}) {
  return (
    <Link
      to="/notes/$noteId"
      params={{noteId: note.id}}
      className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs transition-shadow hover:shadow-lg"
      id={`note-item-${note.id}`}
    >
      <div className="relative p-6">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-primary/10 opacity-30 transition-opacity group-hover:opacity-70" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-xl tracking-tight line-clamp-1">
              {note.name}
            </h3>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="!text-destructive focus:bg-destructive/10"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Updated at */}
          {note.updatedAt ? (
            <p className="text-sm text-muted-foreground">
              Updated {getRelativeTimeString(new Date(note.updatedAt))}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Created {getRelativeTimeString(new Date(note.createdAt))}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function NoteList(props: {notes: GetNotesListQueryResult}) {
  const z = useZ();

  const handleDelete = (noteId: string) => {
    z.mutate.notesTable.update({
      id: noteId,
      deletedAt: Date.now(),
    });
    toast.success("Note deleted");
  };

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {props.notes.map((note) => (
        <NoteItem
          note={note}
          key={note.id}
          onDelete={() => handleDelete(note.id)}
        />
      ))}
    </ul>
  );
}
