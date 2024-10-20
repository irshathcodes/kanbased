"use client";
import { CreateColumn } from "@/components/create-column";
import { Columns } from "@/components/columns";
import { useRepContext } from "@/components/replicache-provider";
import { Button } from "@/components/ui/button";
import { useGetStoreData } from "@/hooks/use-data-store";
import { routeMap } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useBetterParams } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export const dynamicParams = false;
export const dynamic = "force-static";

export default function BoardPage() {
  const { boardName } = useBetterParams<{ boardName: string }>();
  const rep = useRepContext();
  const router = useRouter();
  const boards = useGetStoreData("boards");
  const tabs = useGetStoreData("tabs");
  const hasRanEffect = useRef(false);

  useEffect(() => {
    if (hasRanEffect.current || !boards?.length) return;
    const isBoardExist = boards.some((board) => board.name === boardName);
    if (!isBoardExist) {
      router.replace(routeMap.boards);
      return;
    }
    const isTabExist = tabs?.some((tab) => tab.name === boardName);

    if (!isTabExist) {
      rep.mutate.createTab({
        name: boardName,
        color: "",
        order: tabs?.length ?? 0,
      });
    }

    hasRanEffect.current = true;
  }, [boards, tabs]);

  return (
    <main className="px-8 pt-4 flex-1 h-full min-h-0 flex flex-col gap-8">
      <div className="flex justify-between gap-4 items-center shrink-0">
        <h1 className="text-2xl capitalize font-bold">{boardName}</h1>
        <CreateColumn
          boardId={boardName}
          trigger={
            <Button type="button" size="icon">
              <PlusIcon />
            </Button>
          }
        />
      </div>

      <div className="flex-1 h-full min-h-0">
        <Columns />
      </div>
    </main>
  );
}
