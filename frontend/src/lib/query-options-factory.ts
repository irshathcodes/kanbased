import { authClient } from "@/lib/auth";
import { AuthError, tryCatch } from "@/lib/utils";
import { GetSessionResponse } from "@/types/type-helpers";
import { queryOptions, QueryClient } from "@tanstack/react-query";

export async function fetchSession() {
  const { data, error } = await authClient.getSession();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new AuthError({
      status: 401,
      statusText: "Unauthorized",
    });
  }

  return data;
}

// I'm doing this whole cache thing because On page reload, I don't want to wait for the
// getSession API call to complete to render our app. But still fetch the session details
// from the server in the background.
export async function fetchSessionWithCache(queryClient: QueryClient) {
  const stringifiedData = localStorage.getItem("session-detail");
  const queryState = queryClient.getQueryState(sessionQueryOptions.queryKey);

  let data: GetSessionResponse | null = null;

  if (stringifiedData) {
    const { data: cachedSession } = await tryCatch<GetSessionResponse>(
      JSON.parse(stringifiedData),
    );

    if (
      cachedSession &&
      cachedSession?.session?.expiresAt &&
      new Date(cachedSession.session.expiresAt) > new Date()
    ) {
      data = cachedSession;
    }
  }

  if (!data || queryState?.isInvalidated) {
    const res = await fetchSession();
    localStorage.setItem("session-detail", JSON.stringify(res));

    queryClient.setQueryDefaults(sessionQueryOptions.queryKey, {
      meta: {
        isFetchedOnce: true,
      },
    });

    return res;
  } else {
    fetchSession()
      .then((res) => {
        localStorage.setItem("session-detail", JSON.stringify(res));

        queryClient.setQueryDefaults(sessionQueryOptions.queryKey, {
          meta: {
            isFetchedOnce: true,
          },
        });

        queryClient.setQueryData(sessionQueryOptions.queryKey, res);
      })
      .catch(() => {
        localStorage.removeItem("session-detail");
        queryClient.invalidateQueries(sessionQueryOptions);
      });

    return data;
  }
}

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: async ({ client }) => fetchSessionWithCache(client),
  staleTime: ({ meta }) => {
    return meta?.isFetchedOnce ? Infinity : 0;
  },
});
