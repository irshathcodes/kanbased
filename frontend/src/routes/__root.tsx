import { api } from "@/lib/openapi-react-query";
import { queryClient } from "@/lib/query-client";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Route = createRootRoute({
  component: RootComponent,
  loader: () => {
    queryClient.prefetchQuery(api.queryOptions("get", "/current-user"));
    return null;
  },
  shouldReload: false,
  loaderDeps: (opt) => ({}),
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="bottom" />
    </>
  );
}
