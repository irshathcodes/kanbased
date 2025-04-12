import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { getOrigin } from "@/lib/constants";
import { handleAuthResponse } from "@/lib/utils";
import { useLoggedInRedirect } from "@/hooks/use-logged-in-redirect";

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  useLoggedInRedirect();
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { email: string; redirectTo: string }) => {
      const res = await authClient.forgetPassword(data);
      return handleAuthResponse(res);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;

    toast.promise(
      () =>
        forgotPasswordMutation.mutateAsync({
          email,
          redirectTo: `${getOrigin()}/reset-password`,
        }),
      {
        loading: "Sending reset link...",
        success: "Reset link sent successfully",
        error: "Failed to send reset link",
      },
    );
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                required
                autoFocus
                name="email"
              />
            </div>
            <Button type="submit" className="w-full">
              {forgotPasswordMutation.isPending && <Spinner />}
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
