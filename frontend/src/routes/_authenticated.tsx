import { sessionQueryOptions } from "@/lib/query-options-factory";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { queryClient } from "@/lib/query-client";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const { error, data } = await queryClient.fetchQuery(sessionQueryOptions);

    if (error) {
      throw error;
    }

    if (data === null) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (
      !data?.session.activeOrganizationId &&
      !location.pathname?.includes("/new-organization")
    ) {
      throw redirect({
        to: "/new-organization",
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
