"use client";

import { KanbanSquare } from "lucide-react";
import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { linkOptions } from "@tanstack/react-router";
import { NavGroupType } from "@/components/nav-group";
import { NavGroup } from "@/components/nav-group";
import { useZ } from "@/lib/zero-cache";
import { getBoardsListQuery } from "@/lib/zero-queries";
import { useQuery } from "@rocicorp/zero/react";

export function NavBoards() {
  const z = useZ();
  const [boards] = useQuery(getBoardsListQuery(z));

  const navGroup: NavGroupType = {
    title: "Boards",
    linkProps: linkOptions({ to: "/boards" }),
    icon: KanbanSquare,
    items: boards.map((board) => ({
      title: board.name,
      linkProps: linkOptions({
        to: "/boards/$slug",
        params: {
          slug: board.slug,
        },
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
