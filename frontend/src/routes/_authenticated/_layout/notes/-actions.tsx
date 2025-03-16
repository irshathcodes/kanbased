import { CreateNote } from "@/features/notes/components/create-note";
import { focusElementWithDelay } from "@/lib/helpers";
import { useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/_authenticated/_layout/notes");

export function Actions() {
  const router = useRouter();
  const { createNote } = routeApi.useSearch();

  const handleClose = () => {
    router.navigate({ to: ".", search: undefined });
    focusElementWithDelay(document.getElementById("create-note-button"));
  };

  if (createNote) {
    return (
      <CreateNote
        onClose={handleClose}
        afterSave={() => {
          router.navigate({ to: ".", search: undefined });
        }}
      />
    );
  }

  return null;
}
