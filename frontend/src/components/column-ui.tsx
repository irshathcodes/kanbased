import { cn } from "@/lib/utils";
import React, { Ref } from "react";

export const ColumnWrapper = ({
  ref,
  className,
  ...rest
}: React.ComponentProps<"div"> & {
  ref?: Ref<HTMLDivElement>;
}) => {
  return (
    <div
      className={cn(
        "w-72 py-1 px-1 pb-2.5 shadow-inner bg-gray-2 rounded-lg space-y-3 shrink-0 border max-h-full flex flex-col h-fit",
        className,
      )}
      ref={ref}
      {...rest}
    ></div>
  );
};
