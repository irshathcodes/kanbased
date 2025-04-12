import {
  activeOrganizationQueryOptions,
  organizationsListQueryOptions,
} from "@/lib/query-options-factory";
import { useSession } from "@/queries/session";
import { useQuery } from "@tanstack/react-query";

export function useActiveOrganizationQuery() {
  const { session } = useSession();
  return useQuery(
    activeOrganizationQueryOptions(
      session.activeOrganizationId,
      session.userId,
    ),
  );
}

export function useOrganizationsListQuery() {
  const { session } = useSession();
  return useQuery(organizationsListQueryOptions(session.userId));
}
