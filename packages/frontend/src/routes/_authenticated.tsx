import { sessionQueryOptions } from "@/lib/query-options-factory";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { queryClient } from "@/lib/query-client";
import { tryCatch } from "@/lib/utils";
import { AuthError } from "@/lib/utils";

const updatedSessionQueryOptions = {
  ...sessionQueryOptions,
  revalidateIfStale: true,
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { data, error } = await tryCatch(
      queryClient.ensureQueryData(updatedSessionQueryOptions),
    );

    const isSessionExpired = data?.session.expiresAt
      ? new Date(data.session.expiresAt) < new Date()
      : false;

    if (error instanceof AuthError || isSessionExpired) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (error) {
      throw error;
    }

    const hasNoActiveOrganization =
      data?.session && !data.session.activeOrganizationId;

    if (
      hasNoActiveOrganization &&
      !location.pathname?.includes("/new-organization")
    ) {
      throw redirect({
        to: "/new-organization",
      });
    }
  },

  component: RouteComponent,

  errorComponent: (error) => {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-96">
          <p className="text-destructive text-2xl font-bold mb-2">
            {error?.error?.message}
          </p>
          <p className="text-destructive">
            Something went wrong, Try refreshing the page.
          </p>
        </div>
      </div>
    );
  },
});

function RouteComponent() {
  return <Outlet />;
}
