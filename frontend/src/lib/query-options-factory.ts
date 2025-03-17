import { authClient } from "@/lib/auth";
import { api } from "@/lib/openapi-react-query";
import { queryClient } from "@/lib/query-client";
import { handleAuthResponse } from "@/lib/utils";
import { ColumnsWithTasksResponse } from "@/types/api-response-types";
import { QueryKey, queryOptions } from "@tanstack/react-query";

export function columnsQueryOptions(boardUrl: string) {
  return queryOptions({
    ...api.queryOptions("get", "/api/v1/columns", {
      params: { query: { boardUrl } },
    }),
  });
}

export const boardsQueryOptions = queryOptions({
  ...api.queryOptions("get", "/api/v1/boards"),
  staleTime: 2000,
});

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: () => authClient.getSession(),
  // TODO: Need to revisit this later.
  staleTime: 0,
});

export const activeOrganizationQueryOptions = (
  organizationId: string | null | undefined,
  userId: string
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

export function taskDetailQueryOptions(params: { taskId: string, columnsQueryKey: QueryKey }) {
  return queryOptions({
    ...api.queryOptions("get", "/api/v1/tasks/{taskId}", {
      params: { path: { taskId: params.taskId } },
      staleTime: 0,
    }),
    placeholderData: () => {
      const columns = queryClient.getQueryData(params.columnsQueryKey) as ColumnsWithTasksResponse;
      const task = columns?.tasks?.find(task => task.id === params.taskId);


      return {
        columnId: task?.columnId ?? '',
        content: '',
        createdAt: '',
        deletedAt: '',
        id: task?.id ?? '',
        name: task?.name ?? '',
        position: task?.position ?? 0,
        updatedAt: '',
      }
    },
  });
}

export function getNoteQueryOptions(params: { noteId: string }) {
  return queryOptions({
    ...api.queryOptions("get", "/api/v1/notes/{noteId}", {
      params: { path: { noteId: params.noteId } },
    }),
  });
}

export const getAllNotesQueryOptions = queryOptions({
  ...api.queryOptions("get", "/api/v1/notes"),
});
