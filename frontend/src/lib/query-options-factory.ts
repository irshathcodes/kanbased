import { authClient } from "@/lib/auth";
import { AuthError, handleAuthResponse } from "@/lib/utils";
import { queryOptions } from "@tanstack/react-query";
import { isSessionLoaded, setSessionLoaded } from "@/lib/constants";

export async function fetchSession({
  shouldSetSessionLoaded = false,
}: {
  shouldSetSessionLoaded?: boolean;
} = {}) {
  const { error, data } = await authClient.getSession();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new AuthError({
      status: 401,
      statusText: "Unauthorized",
    });
  }

  shouldSetSessionLoaded && setSessionLoaded();

  return data;
}

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: async () => fetchSession({ shouldSetSessionLoaded: true }),
  staleTime: () => (isSessionLoaded() ? Infinity : 0),
});

export const activeOrganizationQueryOptions = (
  organizationId: string | null | undefined,
  userId: string,
) =>
  queryOptions({
    queryKey: [userId, "organizations", organizationId],
    queryFn: async () => {
      const res = await authClient.organization.getFullOrganization({
        query: { organizationId: organizationId! },
      });
      return handleAuthResponse(res);
    },
    enabled: !!organizationId,
  });

export const organizationsListQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [userId, "organizations"],
    queryFn: async () => {
      const res = await authClient.organization.list();
      return handleAuthResponse(res);
    },
    enabled: !!userId,
  });
