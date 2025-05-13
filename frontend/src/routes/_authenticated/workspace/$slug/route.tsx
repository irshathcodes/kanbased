import {useQuery} from "@rocicorp/zero/react";
import {createFileRoute} from "@tanstack/react-router";
import {useZ} from "@/lib/zero-cache";
import {getOrganizationQuery} from "@/lib/zero-queries";

export const Route = createFileRoute("/_authenticated/workspace/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const {slug} = Route.useParams();
  const z = useZ();
  const [organization] = useQuery(getOrganizationQuery(z, slug));

  if (!organization) {
    return (
      <div>
        Organization not found or something went wrong while loading the
        organization
      </div>
    );
  }

  return <div>{JSON.stringify(organization)}</div>;
}
