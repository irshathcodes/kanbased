"use client";

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
import { Link, useRouter } from "@tanstack/react-router";
import { cn, handleAuthResponse } from "@/lib/utils";
import { authClient } from "@/lib/auth";
import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { getOrigin } from "@/lib/constants";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLoggedInRedirect } from "@/hooks/use-logged-in-redirect";
import { useGoogleLoginMutation } from "@/queries/authentication";
import { useGithubLoginMutation } from "@/queries/authentication";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { useResetSessionQueryCache } from "@/queries/session";

export const Route = createFileRoute("/(auth)/login")({
  component: SignIn,
  validateSearch: (search): { redirect?: string } => {
    return {
      redirect:
        typeof search.redirect === "string" ? search.redirect : undefined,
    };
  },
});

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const search = Route.useSearch();

  useLoggedInRedirect();
  useResetSessionQueryCache();

  const callbackURL = search?.redirect
    ? `${getOrigin()}${search.redirect}`
    : getOrigin();

  const userPasswordLoginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await authClient.signIn.email(data);
      return handleAuthResponse(res);
    },
    onSuccess: () => {
      router.history.push(search?.redirect ?? "/");
    },
  });

  const googleLoginMutation = useGoogleLoginMutation({
    callbackURL,
  });

  const githubLoginMutation = useGithubLoginMutation({
    callbackURL,
  });

  const handleUserPasswordLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    userPasswordLoginMutation.mutate({
      email,
      password,
    });
  };

  const handleGoogleLogin = () => {
    googleLoginMutation.mutate();
  };

  const handleGithubLogin = () => {
    githubLoginMutation.mutate();
  };

  return (
    <form
      className="w-full h-svh flex items-center justify-center"
      onSubmit={handleUserPasswordLogin}
    >
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                  tabIndex={-1}
                >
                  Forgot your password?
                </Link>
              </div>

              <div className="flex gap-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  autoComplete="password"
                  name="password"
                  required
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  size="icon"
                  tabIndex={-1}
                  className="px-2"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={userPasswordLoginMutation.isPending}
            >
              {userPasswordLoginMutation.isPending ? <Spinner /> : "Login"}
            </Button>
          </div>

          <Link
            to="/signup"
            className={buttonVariants({
              variant: "link",
              className: "text-left pl-0 w-fit my-2.5",
            })}
          >
            Don't have an account? Sign up
          </Link>
          <div
            className={cn(
              "w-full gap-2 flex items-center",
              "justify-between flex-col",
            )}
          >
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoginMutation.isPending}
            >
              {googleLoginMutation.isPending ? <Spinner /> : <GoogleIcon />}
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              className={cn("w-full gap-2")}
              type="button"
              onClick={handleGithubLogin}
              disabled={githubLoginMutation.isPending}
            >
              {githubLoginMutation.isPending ? <Spinner /> : <GithubIcon />}
              Sign in with Github
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
