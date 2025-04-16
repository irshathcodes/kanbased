import { Zero } from "@rocicorp/zero";
import { useZero } from "@rocicorp/zero/react";
import {
  schema,
  type Schema,
} from "../../../backend/src/zero-cache/zero-schema";
import { authClient } from "@/lib/auth";
import { getToken, setToken } from "@/lib/utils";

export function getZeroCache({ userId }: { userId: string }) {
  return new Zero({
    userID: userId,
    auth: async (status) => {
      const token = getToken();

      if (!token || status === "invalid-token") {
        const { data, error } = await authClient.$fetch<{ token: string }>(
          "/token",
        );

        if (!data || error) {
          console.warn("Cannot get token: Unauthenticated");
          if (!location.pathname.includes("/login")) {
            location.href = "/login";
          }
          return;
        }

        setToken(data.token);

        return data.token;
      }

      return token;
    },
    server: import.meta.env.CLIENT_PUBLIC_SERVER,
    schema: schema,
    kvStore: "mem",
    logLevel: import.meta.env.DEV ? "debug" : undefined,
  });
}

export function useZ() {
  return useZero<Schema>();
}

export type Z = ReturnType<typeof getZeroCache>;
