import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { handleAuthResponse } from "@/lib/utils";

export const Route = createFileRoute("/(auth)/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const router = useRouter();
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { newPassword: string; token: string }) => {
      const res = await authClient.resetPassword(data);
      return handleAuthResponse(res);
    },
  });

  const token = new URLSearchParams(window.location.search).get("token");

  if (!token) {
    return (
      <div className="flex h-svh w-full items-center justify-center">
        <div className="space-y-2">
          <p>Invalid Token</p>
          <Link to="/" className={buttonVariants({ variant: "outline" })}>
            Home
          </Link>
        </div>
      </div>
    );
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newPassword = formData.get("password") as string;

    toast.promise(
      () =>
        resetPasswordMutation.mutateAsync(
          {
            newPassword,
            token,
          },
          {
            onSuccess: () => {
              toast.success("Password reset successfully");
              router.navigate({ to: "/" });
            },
            onError: (error) => {
              if ("message" in error) {
                toast.error(error.message as string);
              }
            },
          },
        ),
      {
        loading: "Resetting password...",
        success: "Password reset successfully",
        error: "Failed to reset password",
        position: "bottom-center",
      },
    );
  };

  return (
    <form
      className="w-full h-svh flex items-center justify-center"
      onSubmit={handleResetPassword}
    >
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={resetPasswordMutation.isPending}
                autoFocus
              />
            </div>
            <Button type="submit" disabled={resetPasswordMutation.isPending}>
              {resetPasswordMutation.isPending && <Spinner />}
              Reset Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
