import { Button } from "@/components/ui/button";
import { ColumnWrapper } from "@/components/column-ui";
import { Input } from "@/components/ui/input";
import { FormEventHandler } from "react";
import { createId } from "@/lib/utils";
import { useZ } from "@/lib/zero-cache";
import { useActiveOrganizationId } from "@/queries/session";

export type CreateColumnProps = {
  data: {
    boardId: string;
    nextPosition: number;
  };
  onClose: () => void;
};

export function CreateColumn(props: CreateColumnProps) {
  const { data } = props;
  const z = useZ();
  const orgId = useActiveOrganizationId();

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const fd = new FormData(formEl);
    const name = fd.get("column-name") as string;

    z.mutate.columnsTable.insert({
      id: createId(),
      boardId: data.boardId,
      name,
      position: data.nextPosition,
      createdAt: Date.now(),
      organizationId: orgId,
      creatorId: z.userID,
    });

    formEl.reset();
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <ColumnWrapper className="!h-[110px] !py-2">
      <form
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            handleClose();
          }
        }}
        onSubmit={handleSubmit}
        className="px-2 pt-0.5"
      >
        <Input
          id="column-name"
          name="column-name"
          placeholder="eg: work column"
          required
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              handleClose();
            }
          }}
        />

        <div className="flex gap-4 w-fit ml-auto mt-4">
          <Button onClick={handleClose} type="button" variant="ghost" size="sm">
            Cancel
          </Button>

          <Button type="submit" size="sm">
            Save
          </Button>
        </div>
      </form>
    </ColumnWrapper>
  );
}
