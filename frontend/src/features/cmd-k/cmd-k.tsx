"use client";

import * as React from "react";
import {
  ArrowUpDown,
  FileText,
  KanbanSquare,
  Keyboard,
  SquareCheck,
  SunMoon,
} from "lucide-react";

import {useQuery} from "@rocicorp/zero/react";
import {useRouter} from "@tanstack/react-router";
import {useEffect, useState} from "react";
import {useHotkeys} from "react-hotkeys-hook";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandSubtitle,
} from "@/components/ui/command";
import {useZ} from "@/lib/zero-cache";
import {allBoardsQuery, getNotesListQuery} from "@/lib/zero-queries";
import {useAppContext} from "@/state/app-state";
import {CommandThemes} from "@/features/cmd-k/cmd-themes";
import {CommandOrgSwitch} from "@/features/cmd-k/cmd-org-switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {CommandTasks} from "@/features/cmd-k/cmd-tasks";

type Page = "boards" | "notes" | "tasks" | "theme" | "organization";

export function CommandDialog() {
  const {isCmdKOpen, openCmdK, closeCmdK, openHelp} = useAppContext();
  const [pages, setPages] = useState<Array<Page>>([]);
  const page = pages[pages.length - 1];
  const router = useRouter();
  const z = useZ();
  const [boards] = useQuery(allBoardsQuery(z));
  const [search, setSearch] = useState("");

  const allTasks = boards.reduce(
    (
      allTasks: Array<{id: string; name: string; boardId: string}>,
      currentBoard,
    ) => {
      const tasks = currentBoard.columns.flatMap((column) =>
        column.tasks.map((task) => ({
          id: task.id,
          name: task.name,
          boardId: currentBoard.id,
        })),
      );

      allTasks.push(...tasks);

      return allTasks;
    },
    [],
  );
  const [notes] = useQuery(getNotesListQuery(z));

  const clearSearch = () => {
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" || (e.key === "Backspace" && !search)) {
      e.preventDefault();
      if (pages.length) {
        setPages((prevPages) => prevPages.slice(0, -1));
        clearSearch();
      } else {
        e.key === "Escape" && closeCmdK();
      }
    }
  };

  useHotkeys(
    "mod+k",
    () => {
      openCmdK();
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
      enableOnContentEditable: true,
    },
  );

  useEffect(() => {
    if (!isCmdKOpen) {
      setTimeout(() => {
        setPages([]);
        setSearch("");
      }, 100);
    }
  }, [isCmdKOpen]);

  return (
    <Dialog open={isCmdKOpen} onOpenChange={closeCmdK}>
      <DialogHeader className="sr-only">
        <DialogTitle>Command Palette</DialogTitle>
        <DialogDescription>Search for a command to run...</DialogDescription>
      </DialogHeader>

      <DialogContent
        className="overflow-hidden p-0"
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <Command
          className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
          onKeyDown={handleKeyDown}
        >
          <CommandInput
            placeholder="Search for a command..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandSeparator />

            {page === "theme" && <CommandThemes />}
            {page === "organization" && <CommandOrgSwitch />}
            {page === "tasks" && <CommandTasks allTasks={allTasks} />}

            {search && !page && <CommandThemes />}

            {!page && (
              <>
                <CommandGroup heading="Suggestions">
                  <CommandItem
                    onSelect={() => {
                      setPages((prevPages) => [...prevPages, "organization"]);
                      clearSearch();
                    }}
                  >
                    <ArrowUpDown />
                    Switch workspace
                  </CommandItem>
                  <CommandItem
                    onSelect={() => {
                      setPages((prevPages) => [...prevPages, "theme"]);
                      clearSearch();
                    }}
                  >
                    <SunMoon />
                    Change theme
                  </CommandItem>

                  <CommandItem
                    onSelect={() => {
                      openHelp();
                      closeCmdK();
                    }}
                  >
                    <Keyboard />
                    Keyboard Shortcuts
                  </CommandItem>

                  <CommandItem
                    onSelect={() => {
                      router.navigate({to: "/boards"});
                      closeCmdK();
                    }}
                  >
                    <KanbanSquare />
                    <span>Boards</span>
                  </CommandItem>

                  <CommandItem
                    onSelect={() => {
                      router.navigate({to: "/notes"});
                      closeCmdK();
                    }}
                  >
                    <FileText />
                    <span>Notes</span>
                  </CommandItem>

                  <CommandItem
                    onSelect={() => {
                      setPages((prevPages) => [...prevPages, "tasks"]);
                      clearSearch();
                    }}
                  >
                    <SquareCheck />
                    <span>Tasks</span>
                  </CommandItem>
                </CommandGroup>

                <CommandSeparator className="my-2" />

                {boards.length > 0 && (
                  <CommandGroup heading="Boards">
                    {boards.map((board) => (
                      <CommandItem
                        key={board.id}
                        value={`${board.name} ${board.id}`}
                        onSelect={() => {
                          router.navigate({
                            to: "/boards/$boardId",
                            params: {boardId: board.id},
                          });
                          closeCmdK();
                        }}
                      >
                        <KanbanSquare />
                        <span className="flex-1 truncate">{board.name}</span>
                        <CommandSubtitle className="shrink-0">
                          Board
                        </CommandSubtitle>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {notes.length > 0 && (
                  <CommandGroup heading="Notes">
                    {notes.map((note) => (
                      <CommandItem
                        key={note.id}
                        value={`${note.name} ${note.id}`}
                        onSelect={() => {
                          router.navigate({
                            to: "/notes/$noteId",
                            params: {noteId: note.id},
                          });
                          closeCmdK();
                        }}
                      >
                        <FileText />
                        <span>{note.name}</span>
                        <CommandSubtitle>Note</CommandSubtitle>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                <CommandSeparator />
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
