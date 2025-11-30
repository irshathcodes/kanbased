import {useMemo} from "react";
import {Outlet, createFileRoute, linkOptions} from "@tanstack/react-router";
import type {BreadcrumbsData} from "@/components/tsr-breadcrumbs";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarProvider} from "@/components/ui/sidebar";
import {getSidebarStateFromCookie} from "@/lib/utils";
import {TopSection} from "@/components/top-section";
import {CommandDialog} from "@/features/cmd-k/cmd-k";
import {OrganizationDedicatedSwitch} from "@/features/cmd-k/organization-dedicated-switch";
import {KeyboardShortcutsDialog} from "@/features/help/keyboard-shortcuts-dialog";

export const Route = createFileRoute("/_authenticated/_layout")({
  component: RouteComponent,
  loader: (): BreadcrumbsData => ({
    breadcrumbs: linkOptions([
      {
        to: "/",
        label: "Home",
      },
    ]),
  }),
});

function RouteComponent() {
  const defaultSidebarState = useMemo(getSidebarStateFromCookie, []);

  return (
    <SidebarProvider defaultOpen={defaultSidebarState}>
      <AppSidebar />

      <main className="flex flex-col h-svh flex-1">
        <TopSection />

        <div className="flex-1 min-h-0 h-full">
          <Outlet />
        </div>
      </main>

      <CommandDialog />
      <OrganizationDedicatedSwitch />
      <KeyboardShortcutsDialog />
    </SidebarProvider>
  );
}
