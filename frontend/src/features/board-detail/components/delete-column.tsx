import { useZ } from "@/lib/zero-cache";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeleteColumn({
  columnId,
  onClick,
  className,
  ...rest
}: React.ComponentProps<"button"> & { columnId: string }) {
  const z = useZ();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);

    z.mutate.columnsTable.update({
      id: columnId,
      deletedAt: Date.now(),
    });
  };

  return (
    <button
      onClick={handleDelete}
      type="button"
      className={cn("text-destructive focus:text-destructive", className)}
      {...rest}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete Column
    </button>
  );
}
