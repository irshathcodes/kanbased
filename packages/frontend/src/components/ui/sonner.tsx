"use client";

import { useAppContext } from "@/state/app-state";
import { Toaster as Sonner } from "sonner";
import { cn } from "@/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = (props: ToasterProps) => {
  const { theme } = useAppContext();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      closeButton
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          title: "group-[.toast]:text-base group-[.toast]:font-medium",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "[&>div>svg]:text-emerald-500",
          error: "[&>div>svg]:text-red-500",
          warning: "[&>div>svg]:text-yellow-500",
          info: "[&>div>svg]:text-blue-500",
          closeButton: "absolute left-[95.5%] top-2.5",
        },
        style: {
          border: "1px solid var(--gray-8)",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
