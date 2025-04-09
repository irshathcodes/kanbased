"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, LinkProps } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";

export type NavGroupType = {
  title: string;
  linkProps: LinkProps;
  icon: LucideIcon;
  /** @default true */
  defaultOpen?: boolean;
  items?: NavItem[];
  isItemsLoading?: boolean;
};

export type NavItem = {
  title: string;
  linkProps: LinkProps;
};

export function NavGroup(props: NavGroupType) {
  const { items, linkProps, title, isItemsLoading, defaultOpen = true } = props;

  const savedOpen = localStorage.getItem(`nav-group-${title}-open`);

  const handleOpenChange = (open: boolean) => {
    localStorage.setItem(`nav-group-${title}-open`, String(open));
  };

  return (
    <Collapsible
      key={title}
      asChild
      defaultOpen={savedOpen ? savedOpen === "true" : defaultOpen}
      onOpenChange={handleOpenChange}
    >
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={title}>
          <Link
            {...linkProps}
            activeProps={{
              "data-active": true,
            }}
            activeOptions={{
              exact: true,
            }}
          >
            {<props.icon />}
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
        {items?.length || isItemsLoading ? (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRight />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {isItemsLoading ? (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  items?.map((subItem, i) => (
                    <SidebarMenuSubItem key={`${subItem.title}-${i}`}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          {...subItem.linkProps}
                          activeProps={{
                            "data-active": true,
                          }}
                        >
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  );
}
