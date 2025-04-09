import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserSettings } from "@/features/user/user-settings";
import { BackButton } from "@/components/back-button";

export const Route = createFileRoute("/_authenticated/user-settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4">
      <div className="py-4 px-4 shrink-0 w-fit">
        <BackButton variant="outline">Go back</BackButton>
      </div>
      <UserSettings />
    </div>
  );
}
