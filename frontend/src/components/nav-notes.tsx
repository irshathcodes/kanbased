import { FileText } from "lucide-react";
import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { linkOptions } from "@tanstack/react-router";
import { NavGroupType } from "@/components/nav-group";
import { NavGroup } from "@/components/nav-group";
import { useQuery } from "@rocicorp/zero/react";
import { getNotesListQuery } from "@/lib/zero-queries";
import { useZ } from "@/lib/zero-cache";

export function NavNotes() {
  const z = useZ();
  const [notes] = useQuery(getNotesListQuery(z));

  const navGroup: NavGroupType = {
    title: "Notes",
    linkProps: linkOptions({ to: "/notes" }),
    icon: FileText,
    items: notes.map((note) => ({
      title: note.name,
      linkProps: linkOptions({
        to: "/notes/$noteId",
        params: { noteId: note.id },
      }),
    })),
  };

  return (
    <SidebarGroup className="py-1">
      <SidebarMenu>
        <NavGroup {...navGroup} />
      </SidebarMenu>
    </SidebarGroup>
  );
}
