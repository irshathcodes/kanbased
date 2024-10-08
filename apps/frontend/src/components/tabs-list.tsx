"use client";
import { useRepContext } from "@/components/replicache-provider";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routeMap } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn, useBetterParams } from "@/lib/utils";
import { useGetStoreData } from "@/hooks/use-data-store";
import { memo } from "react";

export const TabsList = memo(function TabsList() {
  const router = useRouter();
  const rep = useRepContext();
  const tabs = useGetStoreData("tabs");
  const boards = useGetStoreData("boards");
  const { boardName } = useBetterParams<{ boardName: string }>();

  return (
    <div className="flex gap-4 items-center">
      <ul className="flex gap-3">
        {tabs
          ?.slice()
          .sort((a, b) => a.order - b.order)
          .map((tab) => {
            const isActiveBoard = tab.name === boardName;
            return (
              <li
                key={tab.id}
                className={cn(
                  "px-2.5 py-2 w-32 flex items-center justify-between gap-0.5 rounded-lg border group",
                  isActiveBoard && "bg-secondary text-secondary-foreground"
                )}
              >
                <Link
                  className="flex items-center gap-1.5 w-full flex-1 min-w-0"
                  href={routeMap.board(tab.name)}
                >
                  <div className="w-[1.125rem] h-[1.125rem] bg-indigo-600 rounded-full shrink-0" />
                  <div className="capitalize truncate text-sm">{tab.name}</div>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    rep.mutate.deleteTab({ id: tab.id });
                    router.replace(routeMap.boards);
                  }}
                  className={cn(
                    "shrink-0 rounded-full p-0.5 hover:bg-secondary hover:text-secondary-foreground",
                    isActiveBoard ? "visible" : "invisible group-hover:visible"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </li>
            );
          })}
      </ul>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({
            size: "icon",
            variant: "outline",
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 !p-3">
          {boards
            ?.filter((board) => !tabs?.some((tab) => tab.name === board.name))
            .map((board) => (
              <DropdownMenuItem key={board.name} asChild>
                <Link href={routeMap.board(board.name)}>{board.name}</Link>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
