import * as React from "react";
import {Tooltip as TooltipPrimitive} from "radix-ui";

import {cn} from "@/lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export {Tooltip, TooltipTrigger, TooltipContent, TooltipProvider};

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
      <Tooltip delayDuration={700} {...tooltipProps}>
        {asChild ? <TooltipTrigger asChild>{trigger}</TooltipTrigger> : trigger}
        <TooltipContent {...tooltipContentProps}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

WrappedTooltip.displayName = "WrappedTooltip";
