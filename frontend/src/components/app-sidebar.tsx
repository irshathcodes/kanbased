import * as React from "react";
import { useEffect } from "react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { NavBoards } from "@/components/nav-boards";
import { NavNotes } from "@/components/nav-notes";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  useEffect(() => {
    const activeSidebarButton = document.querySelector(
      '[data-sidebar="menu-sub-button"][data-status="active"]',
    );

    if (activeSidebarButton) {
      activeSidebarButton.scrollIntoView({
        block: "nearest",
      });
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>

      <SidebarContent className="!gap-0 mt-3">
        <NavBoards />
        <NavNotes />
      </SidebarContent>

      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
