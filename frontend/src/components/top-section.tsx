import {SearchIcon} from "lucide-react";
import {TsrBreadcrumbs} from "@/components/tsr-breadcrumbs";
import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar";
import {WrappedTooltip} from "@/components/ui/tooltip";
import {Separator} from "@/components/ui/separator";
import {KeyboardShortcutIndicator} from "@/components/keyboard-shortcut";
import {useAppContext} from "@/state/app-state";
import {UserMenu} from "./user-menu";

export function TopSection() {
  const {isMobile, state} = useSidebar();
  const {openCmdK} = useAppContext();

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
      className="sticky top-0 right-0 z-5 flex items-center gap-2 justify-between py-1 px-3 border-b bg-background shrink-0"
      style={{
        left: getSidebarWidth(),
        width: `calc(100vw - ${getSidebarWidth()}`,
      }}
    >
      <div className="flex items-center gap-2 py-1">
        <WrappedTooltip>
          <SidebarTrigger className="self-center" />
          <span>Toggle sidebar (⌘+B)</span>
        </WrappedTooltip>

        <Separator orientation="vertical" className="mr-2 h-4" />
        <TsrBreadcrumbs />
      </div>

      <div className="shrink-0 flex items-center gap-2 *:shrink-0">
        <button
          type="button"
          className="shrink-0 flex items-center gap-10 text-sm font-medium cursor-pointer bg-muted text-muted-foreground px-2 py-1 rounded-md hover:text-foreground border border-transparent hover:border-accent justify-between w-fit sm:w-60"
          onClick={openCmdK}
        >
          <div className="shrink-0 flex items-center gap-1">
            <SearchIcon className="size-4" />
            <span className="hidden sm:block">Search</span>
          </div>
          <KeyboardShortcutIndicator commandOrCtrlKey className="text-sm">
            K
          </KeyboardShortcutIndicator>
        </button>
        <UserMenu />
      </div>
    </div>
  );
}
