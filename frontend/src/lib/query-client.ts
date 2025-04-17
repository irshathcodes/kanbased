import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthError, UserViewableError } from "@/lib/utils";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: (failureCount, error) => {
        const statusCode = "statusCode" in error ? error.statusCode : undefined;

        if (Number(statusCode) > 500) {
          return true;
        }

        return false;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      meta: {
        showToastOnMutationError: true,
      },
    },
  },
  queryCache: new QueryCache(),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.showToastOnMutationError) {
        if (error instanceof AuthError || error instanceof UserViewableError) {
          toast.error(error.message);
        } else {
          // TODO: Probably not a good idea to give my email here.
          // TODO: Show only user viewable error messages. This needs to handled from backend.
          const message =
            typeof error?.message === "string"
              ? error.message
              : "An unexpected error occurred, please try again later or contact us at irshathv2@gmail.com";
          toast.error(message);
        }
      }
    },
  }),
});

interface MyMeta extends Record<string, unknown> {
  showToastOnQueryError?: boolean;
  showToastOnMutationError?: boolean;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: MyMeta;
    mutationMeta: MyMeta;
    defaultError: Error | UserViewableError | AuthError;
  }
}
