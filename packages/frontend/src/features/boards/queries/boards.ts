import { api } from "@/lib/openapi-react-query";
import { boardsQueryOptions } from "@/lib/query-options-factory";
import { useActiveOrganizationId } from "@/queries/session";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateBoardMutation() {
  const queryClient = useQueryClient();
  const orgId = useActiveOrganizationId();

  return api.useMutation("post", "/api/v1/boards", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boardsQueryOptions({ orgId }).queryKey,
      });
    },
  });
}
