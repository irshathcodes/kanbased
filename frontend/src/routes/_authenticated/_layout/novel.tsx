import {createFileRoute} from "@tanstack/react-router";
import Editor from "@/components/editor";

export const Route = createFileRoute("/_authenticated/_layout/novel")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto px-8 py-8 w-full">
      <Editor />
    </div>
  );
}
