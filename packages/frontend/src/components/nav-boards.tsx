"use client";

import { KanbanSquare } from "lucide-react";
import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { linkOptions } from "@tanstack/react-router";
import { boardsQueryOptions } from "@/lib/query-options-factory";
import { NavGroupType } from "@/components/nav-group";
import { NavGroup } from "@/components/nav-group";
import { useActiveOrganizationId } from "@/queries/session";

export function NavBoards() {
  const orgId = useActiveOrganizationId();
  const { data: boards, isLoading } = useQuery(boardsQueryOptions({ orgId }));

  const navGroup: NavGroupType = {
    title: "Boards",
    linkProps: linkOptions({ to: "/boards" }),
    icon: KanbanSquare,
    isItemsLoading: isLoading,
    items: boards?.map((board) => ({
      title: board.name,
      linkProps: linkOptions({
        to: "/boards/$boardUrl",
        params: {
          boardUrl: board.boardUrl,
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
