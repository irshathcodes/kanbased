import { NoteListResponse } from "@/types/api-response-types";
import { Link } from "@tanstack/react-router";

type Note = NoteListResponse["notes"][number];

function getRelativeTimeString(date: Date): string {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInSecs = Math.round(diffInMs / 1000);
  const diffInMins = Math.round(diffInSecs / 60);
  const diffInHours = Math.round(diffInMins / 60);
  const diffInDays = Math.round(diffInHours / 24);

  if (Math.abs(diffInSecs) < 60) {
    return formatter.format(0, "seconds");
  } else if (Math.abs(diffInMins) < 60) {
    return formatter.format(diffInMins, "minutes");
  } else if (Math.abs(diffInHours) < 24) {
    return formatter.format(diffInHours, "hours");
  } else {
    return formatter.format(diffInDays, "days");
  }
}

function NoteItem({ note }: { note: Note }) {
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

          {/* Updated at */}
          <p className="text-sm text-muted-foreground">
            Updated {getRelativeTimeString(new Date(note.updatedAt))}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function NoteList(props: { notes: NoteListResponse["notes"] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {props.notes?.map((note) => (
        <NoteItem note={note} key={note.id} />
      ))}
    </ul>
  );
}
