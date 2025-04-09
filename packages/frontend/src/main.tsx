import ReactDOM from "react-dom/client";
import {
  ErrorComponent,
  RouterProvider,
  createRouter,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { idbPersister, queryClient } from "@/lib/query-client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import "./tailwind.css";
import { useIsRestoring } from "@tanstack/react-query";
import { DefaultPendingComponent } from "@/components/default-loader";

// Set up a Router instance
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  defaultPendingMinMs: 0,
  defaultPendingMs: 0,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  defaultPendingComponent: DefaultPendingComponent,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

function App() {
  return <RouterProvider router={router} />;
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: idbPersister, maxAge: Infinity }}
    >
      <AppWrapper>
        <App />
      </AppWrapper>
    </PersistQueryClientProvider>,
  );
}

function AppWrapper(props: React.PropsWithChildren) {
  const isRestoring = useIsRestoring();
  if (isRestoring) return null;
  return props.children;
}
