"use client";
import { useRepContext } from "@/components/replicache-provider";
import { TabsList } from "@/components/tabs-list";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routeMap } from "@/lib/constants";
import Link from "next/link";

export function TopSection() {
  const rep = useRepContext();
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 px-4">
      <div className="flex gap-6 items-center flex-1">
        <Link
          href={routeMap.boards}
          className={buttonVariants({
            size: "icon",
            variant: "outline",
            className: "shrink-0",
          })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2rem"
            height="2rem"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M6 19h3.692v-5.077q0-.343.233-.575q.232-.233.575-.233h3q.343 0 .576.233q.232.232.232.575V19H18v-8.692q0-.154-.067-.28t-.183-.22L12.366 5.75q-.154-.134-.366-.134t-.365.134L6.25 9.808q-.115.096-.183.22t-.067.28zm-1 0v-8.692q0-.384.172-.727t.474-.565l5.385-4.078q.423-.323.966-.323t.972.323l5.385 4.077q.303.222.474.566q.172.343.172.727V19q0 .402-.299.701T18 20h-3.884q-.344 0-.576-.232q-.232-.233-.232-.576v-5.076h-2.616v5.076q0 .344-.232.576T9.885 20H6q-.402 0-.701-.299T5 19m7-6.711"
            ></path>
          </svg>
        </Link>
        {/* Tab sectionn */}
        <div className="flex-1">
          <TabsList />
        </div>
      </div>
      <div className="flex gap-4 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="bg-muted text-muted-foreground">
              <AvatarFallback>IR</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          onClick={() => {
            indexedDB.deleteDatabase(rep.idbName);
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
