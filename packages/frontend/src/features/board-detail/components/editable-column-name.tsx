import { useEditColumnMutation } from "@/features/board-detail/queries/columns";
import { QueryKey } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

export function EditableColumnName(props: {
  columnName: string;
  columnId: string;
  columnsQueryKey: QueryKey;
}) {
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const editColumnMutation = useEditColumnMutation({
    columnsQueryKey: props.columnsQueryKey,
    afterOptimisticUpdate: () => {
      setTimeout(() => {
        flushSync(() => {
          setEdit(false);
        });
      }, 0);
    },
  });

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newName = formData.get(props.columnName) as string;
    editColumnMutation.mutate({
      params: { path: { columnId: props.columnId } },
      body: { name: newName },
    });
  };

  if (edit) {
    return (
      <form onSubmit={handleSubmit} className="flex-1 min-w-0">
        <input
          ref={inputRef}
          name={props.columnName}
          defaultValue={props.columnName}
          required
          onBlur={() => setEdit(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setEdit(false);
            }
          }}
          className="text-lg font-semibold px-1 focus:outline-none focus:border-none focus:ring focus:ring-offset-2 focus:ring-ring rounded w-full bg-background dark:bg-gray-3 focus:ring-offset-background dark:focus:ring-offset-gray-3"
        />
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        flushSync(() => {
          setEdit(true);
        });
        inputRef?.current?.select();
      }}
      className="text-lg font-semibold flex-1 pl-1 text-left focus:outline-none focus:border-none focus:ring focus:ring-offset-2 focus:ring-offset-gray-2 focus:ring-ring rounded bg-inherit"
    >
      {props.columnName}
    </button>
  );
}
