import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { get, set, del } from 'idb-keyval';
import {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client';
import { toast } from 'sonner';
import { AuthError, UserViewableError } from '@/lib/utils';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: (failureCount, error) => {
        const statusCode = 'statusCode' in error ? error.statusCode : undefined;

        if (Number(statusCode) > 500) {
          return true;
        }

        return false;
      },
    },
    mutations: {
      meta: {
        showToastOnMutationError: true,
      }
    }
  },
  queryCache: new QueryCache(),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.showToastOnMutationError) {
        if (error instanceof UserViewableError || error instanceof AuthError) {
          toast.error(error.message);
        } else {
          // TODO: Probably not a good idea to give my email here.
          // TODO: Show only user viewable error messages. This needs to handled from backend.
          const message = typeof error?.message === "string" ? error.message : "An unexpected error occurred, please try again later or contact us at irshathv2@gmail.com";
          toast.error(message);
        }
      }

    },
  }),
})
export const idbPersister = createIDBPersister();

export function createIDBPersister() {
  const idbValidKey = 'reactQuery'
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client)
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey)
    },
    removeClient: async () => {
      await del(idbValidKey)
    },
  } as Persister
}

interface MyMeta extends Record<string, unknown> {
  showToastOnQueryError?: boolean;
  showToastOnMutationError?: boolean;
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: MyMeta;
    mutationMeta: MyMeta;
  }
}
