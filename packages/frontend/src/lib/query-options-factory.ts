import { authClient } from "@/lib/auth";
import { api } from "@/lib/openapi-react-query";
import { queryClient } from "@/lib/query-client";
import { AuthError, handleAuthResponse } from "@/lib/utils";
import { ColumnsWithTasksResponse } from "@/types/api-response-types";
import { QueryKey, queryOptions } from "@tanstack/react-query";
import { isSessionLoaded, setSessionLoaded } from "@/lib/constants";

export function columnsQueryOptions({
  orgId,
  boardUrl,
}: {
  orgId: string;
  boardUrl: string;
}) {
  return queryOptions({
    ...api.queryOptions("get", "/api/v1/columns", {
      params: { query: { boardUrl } },
      organizationId: orgId,
    }),
  });
}

export function boardsQueryOptions({ orgId }: { orgId: string }) {
  return queryOptions({
    ...api.queryOptions("get", "/api/v1/boards", {
      organizationId: orgId,
    }),
  });
}

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

export function taskDetailQueryOptions(params: {
  taskId: string;
  columnsQueryKey: QueryKey;
  orgId: string;
}) {
  return queryOptions({
    ...api.queryOptions("get", "/api/v1/tasks/{taskId}", {
      params: { path: { taskId: params.taskId } },
      organizationId: params.orgId,
    }),
    placeholderData: () => {
      const columns = queryClient.getQueryData(
        params.columnsQueryKey,
      ) as ColumnsWithTasksResponse;
      const task = columns?.tasks?.find((task) => task.id === params.taskId);

      return {
        columnId: task?.columnId ?? "",
        content: "",
        createdAt: "",
        deletedAt: "",
        id: task?.id ?? "",
        name: task?.name ?? "",
        position: task?.position ?? 0,
        updatedAt: "",
      };
    },
  });
}

export function getNoteQueryOptions(params: { noteId: string; orgId: string }) {
  return queryOptions({
    ...api.queryOptions("get", "/api/v1/notes/{noteId}", {
      params: { path: { noteId: params.noteId } },
      organizationId: params.orgId,
    }),
  });
}

export const getAllNotesQueryOptions = ({ orgId }: { orgId: string }) =>
  queryOptions({
    ...api.queryOptions("get", "/api/v1/notes", {
      organizationId: orgId,
    }),
  });
