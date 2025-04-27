import { TsrBreadcrumbs } from "@/components/tsr-breadcrumbs";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { WrappedTooltip } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export function TopSection() {
  const { isMobile, state } = useSidebar();

  const getSidebarWidth = () => {
    if (isMobile) {
      return "0px";
    }

    if (state === "collapsed") {
      return "var(--sidebar-width-icon)";
    }

    return "var(--sidebar-width)";
  };

  return (
    <div
      className="sticky top-0 right-0 z-5 flex items-center gap-2 justify-between py-1 px-2 border-b bg-background shrink-0"
      style={{
        left: getSidebarWidth(),
        width: `calc(100vw - ${getSidebarWidth()} - 1rem)`,
      }}
    >
      <div className="flex items-center gap-2 py-1">
        <WrappedTooltip
          tooltipProps={{ delayDuration: 300 }}
          tooltipContentProps={{
            side: "right",
          }}
        >
          <SidebarTrigger className="self-center" />
          <span>Toggle sidebar (⌘+B)</span>
        </WrappedTooltip>

        <Separator orientation="vertical" className="mr-2 h-4" />
        <TsrBreadcrumbs />
      </div>

      <div className="shrink-0">{/* TODO: Add CMD + K search bar */}</div>
    </div>
  );
}
