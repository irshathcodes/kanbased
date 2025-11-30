"use client";

import {SquareCheck} from "lucide-react";

import {useNavigate} from "@tanstack/react-router";
import {
  CommandGroup,
  CommandItem,
  CommandSubtitle,
} from "@/components/ui/command";
import {useAppContext} from "@/state/app-state";

export function CommandTasks(props: {
  allTasks: Array<{
    id: string;
    name: string;
    boardId: string;
  }>;
}) {
  const navigate = useNavigate();
  const {closeCmdK} = useAppContext();

  return (
    <CommandGroup heading="Tasks">
      {props.allTasks.map((task) => (
        <CommandItem
          key={task.id}
          value={`${task.name} ${task.id}`}
          onSelect={() => {
            navigate({
              to: "/boards/$boardId",
              params: {boardId: task.boardId},
              search: {
                taskId: task.id,
              },
            });
            closeCmdK();
          }}
        >
          <SquareCheck />
          <span className="flex-1 truncate">{task.name}</span>
          <CommandSubtitle className="shrink-0">Task</CommandSubtitle>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
