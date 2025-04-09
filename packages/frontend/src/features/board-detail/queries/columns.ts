import { useForceUpdate } from "@/hooks/use-force-update";
import { transformColumnsQuery } from "@/lib/helpers";
import { api } from "@/lib/openapi-react-query";
import { columnsQueryOptions } from "@/lib/query-options-factory";
import { useActiveOrganizationId } from "@/queries/session";
import { ColumnsWithTasksResponse } from "@/types/api-response-types";
import {
  QueryKey,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export type ColumnsWithTasksQueryData = ReturnType<
  typeof transformColumnsQuery
>;

export function useColumnsSuspenseQuery(params: { boardUrl: string }) {
  const orgId = useActiveOrganizationId();
  return useSuspenseQuery({
    ...columnsQueryOptions({ orgId, boardUrl: params.boardUrl }),
    select: transformColumnsQuery,
  });
}

export function useCreateColumnMutation(params: { columnsQueryKey: QueryKey }) {
  const queryClient = useQueryClient();
  const queryKey = params.columnsQueryKey;
  const mutationKey = ["post", "/api/v1/columns"] as const;

  return api.useMutation(mutationKey[0], mutationKey[1], {
    onMutate: async (variables) => {
      // Cancel any on-going request as it may accidentally update the cache.
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (oldData: ColumnsWithTasksResponse): ColumnsWithTasksResponse => {
          return {
            ...oldData,
            columns: [
              ...oldData.columns,
              {
                boardId: oldData.boardId,
                id: variables.body.id!,
                name: variables.body.name,
                position: variables.body.position,
              },
            ],
          };
        },
      );

      return () => {
        queryClient.setQueryData(queryKey, previousData);
      };
    },
    onError: (_err, _variables, rollback: any) => {
      rollback?.();
    },
    onSettled: () => {
      const isMutating = queryClient.isMutating({ mutationKey });
      if (isMutating <= 1) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}

export function useMoveColumnsMutation(params: { columnsQueryKey: QueryKey }) {
  const queryClient = useQueryClient();
  const queryKey = params.columnsQueryKey;
  const mutationKey = ["patch", "/api/v1/columns/reorder"] as const;
  const forceUpdate = useForceUpdate();

  return api.useMutation(mutationKey[0], mutationKey[1], {
    onMutate: async (variables) => {
      // Cancel any on-going request as it may accidentally update the cache.
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);
      const updatedColPositions = variables.body;

      queryClient.setQueryData(
        queryKey,
        (oldData: ColumnsWithTasksResponse): ColumnsWithTasksResponse => {
          return {
            ...oldData,
            columns: oldData.columns.map((col) => {
              const updatedPosition = updatedColPositions.find(
                (updatedCol) => updatedCol.id === col.id,
              )?.position;
              return { ...col, position: updatedPosition ?? col.position };
            }),
          };
        },
      );

      // Don't know why, but the columns are not updated immediately after the move mutation.
      // So we need to force update the component to reflect the changes.
      forceUpdate();

      return () => {
        queryClient.setQueryData(queryKey, previousData);
      };
    },

    onError: (_err, _variables, rollback: any) => {
      rollback?.();
    },
    onSettled: () => {
      const isMutating = queryClient.isMutating({ mutationKey });
      if (isMutating <= 1) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}

export function useEditColumnMutation(params: {
  columnsQueryKey: QueryKey;
  afterOptimisticUpdate?: () => void;
}) {
  const queryClient = useQueryClient();
  const queryKey = params.columnsQueryKey;

  return api.useMutation("patch", "/api/v1/columns/{columnId}", {
    onMutate: async (variables) => {
      // Cancel any on-going request as it may accidentally update the cache.
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (oldData: ColumnsWithTasksResponse): ColumnsWithTasksResponse => {
          return {
            ...oldData,
            columns: oldData.columns.map((column) =>
              column.id === variables.params.path.columnId
                ? { ...column, name: variables.body.name }
                : column,
            ),
          };
        },
      );

      params.afterOptimisticUpdate?.();

      return () => {
        queryClient.setQueryData(queryKey, previousData);
      };
    },

    onError: (_err, _variables, rollback: any) => {
      rollback?.();
    },
  });
}

export function useDeleteColumnMutation(params: { columnsQueryKey: QueryKey }) {
  const queryClient = useQueryClient();
  const queryKey = params.columnsQueryKey;

  return api.useMutation("delete", "/api/v1/columns/{columnId}", {
    onMutate: async (variables: { params: { path: { columnId: string } } }) => {
      // Cancel any on-going request as it may accidentally update the cache.
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (oldData: ColumnsWithTasksResponse): ColumnsWithTasksResponse => {
          return {
            ...oldData,
            columns: oldData.columns.filter(
              (column) => column.id !== variables.params.path.columnId,
            ),
            tasks: oldData.tasks.filter(
              (task) => task.columnId !== variables.params.path.columnId,
            ),
          };
        },
      );

      return () => {
        queryClient.setQueryData(queryKey, previousData);
      };
    },

    onError: (_err, _variables, rollback: any) => {
      rollback?.();
    },

    onSuccess: () => {
      toast.success("Column deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
