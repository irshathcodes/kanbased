import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { AuthError } from "@/lib/utils";
import { useSession } from "@/queries/session";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,

  errorComponent: (error) => {
    const router = useRouter();

    if (error instanceof AuthError) {
      router.navigate({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

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
  const router = useRouter();
  const data = useSession();

  const isSessionExpired = data?.session.expiresAt
    ? new Date(data.session.expiresAt) < new Date()
    : false;

  if (isSessionExpired) {
    router.navigate({
      to: "/login",
      search: {
        redirect: location.href,
      },
    });
    return null;
  }

  const hasNoActiveOrganization =
    data?.session && !data.session.activeOrganizationId;

  if (
    hasNoActiveOrganization &&
    !location.pathname?.includes("/new-organization")
  ) {
    router.navigate({
      to: "/new-organization",
    });

    return null;
  }

  return <Outlet />;
}
