"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { handleAuthResponse } from "@/lib/utils";
import { queryClient } from "@/lib/query-client";
import { BackButton } from "@/components/back-button";
import { sessionQueryOptions } from "@/lib/query-options-factory";

export const Route = createFileRoute("/_authenticated/new-organization")({
  component: Welcome,
});

function Welcome() {
  const router = useRouter();

  const activeOrgMutation = useMutation({
    mutationFn: async ({ organizationId }: { organizationId: string }) => {
      const res = await authClient.organization.setActive({
        organizationId,
      });
      return handleAuthResponse(res);
    },
  });

  const createOrgMutation = useMutation({
    mutationFn: async ({
      organizationName,
      slug,
    }: {
      organizationName: string;
      slug: string;
    }) => {
      const res = await authClient.organization.create({
        name: organizationName,
        slug,
      });
      return handleAuthResponse(res);
    },
    onSuccess: async (res) => {
      await activeOrgMutation.mutateAsync({
        organizationId: res!.id,
      });

      await queryClient.invalidateQueries(sessionQueryOptions);

      toast.success("Organization created successfully!");

      router.navigate({ to: "/" });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const organizationName = formData.get("organizationName") as string;

    createOrgMutation.mutate({
      organizationName,
      slug: organizationName.toLowerCase().split(" ").join("-"),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <BackButton>Go back</BackButton>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl text-center">Welcome! 👋</CardTitle>
          <CardDescription className="text-center">
            Let's get started by creating your organization. This will be your
            workspace where you can manage all your boards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organization-name">Organization Name</Label>
                <Input
                  id="organization-name"
                  name="organizationName"
                  placeholder="Acme Inc."
                  required
                  autoFocus
                  disabled={createOrgMutation.isPending}
                />
                <p className="text-sm text-muted-foreground">
                  This is the name that will be displayed across your workspace.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={createOrgMutation.isPending}
            >
              {createOrgMutation.isPending ? (
                <>
                  <Spinner />
                  Creating your workspace...
                </>
              ) : (
                "Create Organization"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
