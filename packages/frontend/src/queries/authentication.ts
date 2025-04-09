import { authClient } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { handleAuthResponse } from "@/lib/utils";

export function useGoogleLoginMutation({
  callbackURL,
}: {
  callbackURL: string;
}) {
  return useMutation({
    mutationFn: async () => {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
      return handleAuthResponse(res);
    },
  });
}

export function useGithubLoginMutation({
  callbackURL,
}: {
  callbackURL: string;
}) {
  return useMutation({
    mutationFn: async () => {
      const res = await authClient.signIn.social({
        provider: "github",
        callbackURL,
      });
      return handleAuthResponse(res);
    },
  });
}

/*
      callbackURL: search?.redirect
        ? `${getOrigin()}${search?.redirect}`
        : getOrigin(),
*/
