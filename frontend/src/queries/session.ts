import { sessionQueryOptions } from "@/lib/query-options-factory";
import {
  QueryClient,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

export function getSession(queryClient: QueryClient) {
  const queryData = queryClient.getQueryData(sessionQueryOptions.queryKey);

  if (!queryData) {
    throw new Error("Session detail not found while calling getSessionDetail");
  }

  return queryData;
}

export function useSession() {
  const { data } = useSuspenseQuery(sessionQueryOptions);
  return data;
}

export function getActiveOrganizationId(queryClient: QueryClient) {
  const { session } = getSession(queryClient);
  return session.activeOrganizationId!;
}

export function useActiveOrganizationId() {
  const queryClient = useQueryClient();
  return getActiveOrganizationId(queryClient);
}

export function useResetSessionQueryCache() {
  const queryClient = useQueryClient();

  useEffect(() => {
    localStorage.removeItem("session-detail");
    queryClient.invalidateQueries(sessionQueryOptions);
  }, []);
}
