import { sessionQueryOptions } from "@/lib/query-options-factory";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export function getSession(queryClient: QueryClient) {
  const queryData = queryClient.getQueryData(sessionQueryOptions.queryKey);

  if (!queryData) {
    throw new Error("Session detail not found while calling getSessionDetail");
  }

  return queryData;
}

export function useSession() {
  const router = useRouter();
  const { data } = useQuery(sessionQueryOptions);

  const isSessionExpired = data?.session.expiresAt
    ? new Date(data.session.expiresAt) < new Date()
    : false;

  if (!data || isSessionExpired) {
    router.navigate({ to: "/login" });
  }

  return data!;
}

export function getActiveOrganizationId(queryClient: QueryClient) {
  const { session } = getSession(queryClient);
  return session.activeOrganizationId!;
}

export function useActiveOrganizationId() {
  const queryClient = useQueryClient();
  return getActiveOrganizationId(queryClient);
}
