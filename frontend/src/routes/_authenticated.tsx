import {
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import {useSuspenseQuery} from "@tanstack/react-query";
import {memo, useEffect, useMemo} from "react";
import {ZeroProvider} from "@rocicorp/zero/react";
import {AuthError} from "@/lib/utils";
import {authQueryOptions} from "@/lib/query-options-factory";
import {queryClient} from "@/lib/query-client";
import {preloadAllBoards} from "@/lib/zero-queries";
import {createZeroCache} from "@/lib/zero-cache";
import {useAuthData} from "@/queries/session";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,

  beforeLoad: async () => {
    const {decodedData} = await queryClient.ensureQueryData(authQueryOptions);

    const currentTime = Math.floor(Date.now() / 1000);
    const isAuthExpired = currentTime >= decodedData.exp;

    if (isAuthExpired) {
      localStorage.removeItem("auth-token");
      throw redirect({
        to: "/login",
        reloadDocument: true,
      });
    }

    const hasNoActiveOrganization = !decodedData.activeOrganizationId;

    if (
      hasNoActiveOrganization &&
      !location.pathname.includes("/new-organization")
    ) {
      throw redirect({
        to: "/new-organization",
        reloadDocument: true,
      });
    }
  },

  errorComponent: (error) => {
    const router = useRouter();

    if (error.error instanceof AuthError) {
      router.navigate({
        to: "/login",
        reloadDocument: true,
      });

      return null;
    }

    return (
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-96">
          <p className="text-destructive text-2xl font-bold mb-2">
            {error.error.message}
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
  const {
    data: {decodedData},
    isError,
  } = useSuspenseQuery(authQueryOptions);
  const router = useRouter();

  const redirectToLogin = () => {
    localStorage.removeItem("auth-token");
    router.navigate({
      to: "/login",
      reloadDocument: true,
    });
  };

  // I have to make auth related checks on beforeLoad
  // and also on component here becuase beforeLoad
  // is not reactive and will not update when the query
  // data is updated
  if (isError) {
    redirectToLogin();
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const isAuthExpired = currentTime >= decodedData.exp;

  if (isAuthExpired) {
    redirectToLogin();

    return null;
  }

  const hasNoActiveOrganization = !decodedData.activeOrganizationId;

  if (
    hasNoActiveOrganization &&
    !location.pathname.includes("/new-organization")
  ) {
    router.navigate({
      to: "/new-organization",
    });

    return null;
  }

  return (
    <ZeroWrapped>
      <Outlet />
    </ZeroWrapped>
  );
}

const ZeroWrapped = memo(function ZeroWrapped({
  children,
}: React.PropsWithChildren) {
  const userData = useAuthData();
  const z = useMemo(() => createZeroCache({userId: userData.id}), []);

  useEffect(() => {
    preloadAllBoards(z);
  }, [z]);

  return <ZeroProvider zero={z}>{children}</ZeroProvider>;
});
