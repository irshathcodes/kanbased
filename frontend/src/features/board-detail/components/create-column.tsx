import { Button } from "@/components/ui/button";
import { ColumnWrapper } from "@/components/column-ui";
import { Input } from "@/components/ui/input";
import { FormEventHandler } from "react";
import { createId } from "@/lib/utils";
import { useCreateColumnMutation } from "@/features/board-detail/queries/columns";
import { QueryKey } from "@tanstack/react-query";

export type CreateColumnProps = {
  data: {
    boardId: string;
    nextPosition: number;
    columnsQueryKey: QueryKey;
  };
  onClose: () => void;
};

export function CreateColumn(props: CreateColumnProps) {
  const createColumnMutation = useCreateColumnMutation({
    columnsQueryKey: props.data.columnsQueryKey,
  });

  const { data } = props;

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const fd = new FormData(formEl);
    const name = fd.get("column-name") as string;
    const currentDate = new Date().toISOString();
    formEl.reset();

    createColumnMutation.mutate({
      body: {
        id: createId(),
        boardId: data.boardId,
        name,
        position: data.nextPosition,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });
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
