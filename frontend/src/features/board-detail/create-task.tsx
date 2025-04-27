import { Button } from "@/components/ui/button";
import { CustomizedTextarea } from "@/components/ui/customized-textarea";
import { useInteractiveOutside } from "@/hooks/use-interactive-outside";
import { createId } from "@/lib/utils";
import { useZ } from "@/lib/zero-cache";
import { useActiveOrganizationId } from "@/queries/session";
import { useRef, type FormEvent } from "react";

export type CreateCardProps = {
  columnId: string;
  nextPosition: number;
  onComplete: () => void;
  onAdd: () => void;
};

export function CreateTask(props: CreateCardProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const z = useZ();
  const organizationId = useActiveOrganizationId();

  useInteractiveOutside(wrapperRef, () => {
    props.onComplete();
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const name = textAreaRef.current!.value;
    textAreaRef.current!.value = "";

    await z.mutate.tasksTable.insert({
      id: createId(),
      columnId: props.columnId,
      name,
      position: props.nextPosition,
      createdAt: Date.now(),
      creatorId: z.userID,
      organizationId,
    });

    props.onAdd();
  };

  return (
    <div ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <CustomizedTextarea
          name="task"
          ref={textAreaRef}
          required
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (event.shiftKey) return;
              buttonRef.current!.click();
            }
            if (event.key === "Escape") {
              props.onComplete();
            }
          }}
          autoFocus
          className="min-h-17.5 px-2! resize-none overflow-hidden ring-transparent! text-base!"
        />

        <div className="flex gap-4 w-fit ml-auto">
          <Button
            onClick={props.onComplete}
            type="button"
            variant="ghost"
            size="sm"
          >
            Cancel
          </Button>

          <Button ref={buttonRef} type="submit" size="sm">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
