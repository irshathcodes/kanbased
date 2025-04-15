import { getRelativeTimeString } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { GetNotesListQueryResult } from "@/lib/zero-queries";

function NoteItem({ note }: { note: GetNotesListQueryResult[number] }) {
  return (
    <Link
      to="/notes/$noteId"
      params={{ noteId: note.id }}
      className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative p-6">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50 transition-opacity group-hover:opacity-70" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-xl tracking-tight line-clamp-1">
              {note.name}
            </h3>
          </div>

          {/* Created at */}
          {note.createdAt && (
            <p className="text-sm text-muted-foreground">
              Created {getRelativeTimeString(new Date(note.createdAt))}
            </p>
          )}

          {/* Updated at */}
          {note.updatedAt && (
            <p className="text-sm text-muted-foreground">
              Updated {getRelativeTimeString(new Date(note.updatedAt))}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function NoteList(props: { notes: GetNotesListQueryResult }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {props.notes?.map((note) => <NoteItem note={note} key={note.id} />)}
    </ul>
  );
}
