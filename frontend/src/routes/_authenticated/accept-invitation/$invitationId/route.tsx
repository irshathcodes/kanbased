import { authClient } from "@/lib/auth";
import { handleAuthResponse, getRelativeTimeString } from "@/lib/utils";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Check, X, Building2, User, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { authQueryOptions } from "@/lib/query-options-factory";

export const Route = createFileRoute(
  "/_authenticated/accept-invitation/$invitationId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { invitationId } = Route.useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: invitation } = useSuspenseQuery({
    queryKey: ["invitation", invitationId],
    queryFn: async () => {
      const res = await authClient.organization.getInvitation({
        query: {
          id: invitationId,
        },
      });
      return handleAuthResponse(res);
    },
  });

  const acceptInvitationMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.organization.acceptInvitation({
        invitationId,
      });
      return handleAuthResponse(res);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(authQueryOptions);
      toast.success("Invitation accepted successfully!");
      router.navigate({ to: "/" });
    },
  });

  const declineInvitationMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.organization.rejectInvitation({
        invitationId,
      });
      return handleAuthResponse(res);
    },
    onSuccess: () => {
      toast.success("Invitation declined");
      router.navigate({ to: "/" });
    },
  });

  if (!invitation) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md shadow-lg border-0 bg-linear-to-br from-slate-50 to-slate-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Loading Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Spinner className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = new Date(invitation.expiresAt) < new Date();
  const timeLeft = getRelativeTimeString(new Date(invitation.expiresAt));

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12 bg-linear-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg border-0 overflow-hidden">
        <div className="h-2 bg-linear-to-r from-primary to-primary/70" />
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-center">
            Organization Invitation
          </CardTitle>
          <CardDescription className="text-center">
            You've been invited to join an organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-4">
          <div className="space-y-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Organization</h3>
            </div>
            <p className="text-lg pl-7">{invitation.organizationName}</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Invited by</h3>
            </div>
            <p className="pl-7">{invitation.inviterEmail}</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Role</h3>
            </div>
            <p className="pl-7 capitalize">{invitation.role || "Member"}</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Expires</h3>
            </div>
            <p
              className={cn(
                "pl-7",
                isExpired && "text-destructive font-medium",
              )}
            >
              {isExpired ? "Expired" : timeLeft}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4 pt-2 pb-6 w-full">
          <Button
            variant="outline"
            size="lg"
            onClick={() => declineInvitationMutation.mutate()}
            disabled={declineInvitationMutation.isPending || isExpired}
            className="flex-1"
          >
            {declineInvitationMutation.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Decline
          </Button>
          <Button
            size="lg"
            onClick={() => acceptInvitationMutation.mutate()}
            disabled={acceptInvitationMutation.isPending || isExpired}
            className="flex-1"
          >
            {acceptInvitationMutation.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Accept
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
