import React from "react";
import { cn } from "@/lib/utils";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = ({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) => (
  <CollapsiblePrimitive.CollapsibleContent
    className={cn(
      "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up",
      className,
    )}
    {...props}
  />
);

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
