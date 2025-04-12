import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/queries/session";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { useZ } from "@/lib/zero-cache";

export const Route = createFileRoute("/_authenticated/_layout/")({
  component: HomeComponent,
});

function HomeComponent() {
  const session = useSession();
  const z = useZ();

  const notesQuery = z.query.zero_notes;
  const [notes] = useQuery(notesQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    z.mutate.zero_notes.insert({
      id: crypto.randomUUID(),
      content,
      title,
      created_at: Date.now(),
      updated_at: Date.now(),
      deleted_at: null,
    });

    formElement.reset();
    (formElement.children[0] as HTMLInputElement).focus();
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <Card className="w-full max-w-3xl shadow-lg border-t-4 border-t-primary mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl text-center font-bold">
            Welcome, {session.user.name}! 👋
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center pt-4">
          <p className="mb-8 text-muted-foreground text-lg">
            What would you like to work on today?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link to="/boards" className="w-full">
              <Button
                size="lg"
                className="w-full h-20 text-lg flex flex-col gap-1"
                variant="default"
              >
                <span>📋 Boards</span>
                <span className="text-xs font-normal">
                  Manage your kanban boards
                </span>
              </Button>
            </Link>

            <Link to="/notes" className="w-full">
              <Button
                size="lg"
                className="w-full h-20 text-lg flex flex-col gap-1"
                variant="outline"
              >
                <span>📝 Notes</span>
                <span className="text-xs font-normal">Access your notes</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div>
        <h1>Notes</h1>
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="flex gap-2">
              <h1>{note.title}:</h1>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="border-2 border-gray-300 rounded-md p-2"
          />
          <input
            type="text"
            name="content"
            placeholder="Content"
            className="border-2 border-gray-300 rounded-md p-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
