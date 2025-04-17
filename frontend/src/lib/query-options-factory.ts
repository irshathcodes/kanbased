import { authClient } from "@/lib/auth";
import { AuthError } from "@/lib/utils";
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
