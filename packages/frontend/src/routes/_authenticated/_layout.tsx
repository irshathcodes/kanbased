import { useMemo } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarStateFromCookie } from "@/lib/utils";
import { createFileRoute, linkOptions, Outlet } from "@tanstack/react-router";
import { BreadcrumbsData } from "@/components/tsr-breadcrumbs";
import { TopSection } from "@/components/top-section";
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
    </SidebarProvider>
  );
}
