import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/openapi-react-query";
import { ColumnsWithTasksResponse } from "@/types/api-response-types";
import { useForceUpdate } from "@/hooks/use-force-update";
import { toast } from "sonner";
import { removeUndefinedKeys } from "@/lib/helpers";

export function useCreateTaskMutation(params: {
  columnsQueryKey: QueryKey;
  onOptimisticUpdate?: () => void;
}) {
  const queryClient = useQueryClient();
  const queryKey = params.columnsQueryKey;
  const mutationKey = ["post", "/api/v1/tasks"] as const;

  return api.useMutation("post", "/api/v1/tasks", {
    onMutate: async (variables) => {
      // Cancel any on-going request as it may accidentally update the cache.
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (oldData: ColumnsWithTasksResponse): ColumnsWithTasksResponse => {
          return {
            ...oldData,
            tasks: [
              ...oldData.tasks,
              {
                columnId: variables.body.columnId,
                id: variables.body.id,
                name: variables.body.name,
                position: variables.body.position,
              },
            ],
          };
        },
      );

      params.onOptimisticUpdate?.();

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

export function useMoveTasksMutation(params: { columnsQueryKey: QueryKey }) {
  const queryClient = useQueryClient();
  const queryKey = params.columnsQueryKey;
  const mutationKey = ["put", "/api/v1/tasks"] as const;
  const forceUpdate = useForceUpdate();

  return api.useMutation(mutationKey[0], mutationKey[1], {
    onMutate: async (variables) => {
      // Cancel any on-going request as it may accidentally update the cache.
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      const taskPositionMap = new Map<
        string,
        { columnId: string; position: number }
      >(
        variables.body.map((task) => [
          task.id,
          { columnId: task.columnId, position: task.position },
        ]),
      );

      queryClient.setQueryData(
        queryKey,
        (oldData: ColumnsWithTasksResponse): ColumnsWithTasksResponse => {
          return {
            ...oldData,
            tasks: oldData.tasks.map((task) =>
              taskPositionMap.has(task.id)
                ? { ...task, ...taskPositionMap.get(task.id) }
                : task,
            ),
          };
        },
      );

      // Don't know why, but the columns are not updated immediately.
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

export function useUpdateTaskMutation(params: {
  columnsQueryKey: QueryKey;
  afterOptimisticUpdate?: () => void;
}) {
  const queryClient = useQueryClient();
  const queryKey = params.columnsQueryKey;
  const mutationKey = ["patch", "/api/v1/tasks/{taskId}"] as const;
  const forceUpdate = useForceUpdate();

  return api.useMutation(mutationKey[0], mutationKey[1], {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(
        queryKey,
        (oldData: ColumnsWithTasksResponse): ColumnsWithTasksResponse => {
          const updated = removeUndefinedKeys(variables.body);
          return {
            ...oldData,
            tasks: oldData.tasks.map((task) =>
              task.id === variables.params.path.taskId
                ? { ...task, ...updated }
                : task,
            ),
          };
        },
      );

      forceUpdate();
      params.afterOptimisticUpdate?.();

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

export function useDeleteTaskMutation(params: { columnsQueryKey: QueryKey }) {
  const queryClient = useQueryClient();
  const queryKey = params.columnsQueryKey;

  return api.useMutation("delete", "/api/v1/tasks/{taskId}", {
    onMutate: async (variables: { params: { path: { taskId: string } } }) => {
      // Cancel any on-going request as it may accidentally update the cache.
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(
        queryKey,
        (oldData: ColumnsWithTasksResponse): ColumnsWithTasksResponse => {
          return {
            ...oldData,
            tasks: oldData.tasks.filter(
              (task) => task.id !== variables.params.path.taskId,
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
      toast.success("Task deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
