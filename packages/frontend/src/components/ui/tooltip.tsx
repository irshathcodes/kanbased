import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export function TooltipRoot({
  children,
  providerProps = {},
  tooltipProps = {},
}: React.PropsWithChildren<{
  providerProps?: Omit<
    React.ComponentProps<typeof TooltipProvider>,
    "children"
  >;
  tooltipProps?: React.ComponentProps<typeof Tooltip>;
}>) {
  return (
    <TooltipProvider {...providerProps}>
      <Tooltip {...tooltipProps}>{children}</Tooltip>
    </TooltipProvider>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

export function WrappedTooltip({
  children,
  tooltipProps = {},
  providerProps,
  tooltipContentProps = {},
  asChild = true,
}: React.PropsWithChildren<{
  tooltipProps?: React.ComponentProps<typeof Tooltip>;
  providerProps?: React.ComponentProps<typeof TooltipProvider>;
  tooltipContentProps?: React.ComponentProps<typeof TooltipContent>;
  asChild?: boolean;
}>) {
  const [trigger, content] = React.Children.toArray(children);

  if (!trigger || !content) {
    throw new Error("WrappedTooltip must have a trigger and content");
  }

  return (
    <TooltipProvider {...(providerProps ?? {})}>
      <Tooltip {...tooltipProps}>
        {asChild ? <TooltipTrigger asChild>{trigger}</TooltipTrigger> : trigger}
        <TooltipContent {...tooltipContentProps}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

WrappedTooltip.displayName = "WrappedTooltip";
