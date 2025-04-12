import { Zero } from "@rocicorp/zero";
import { useZero } from "@rocicorp/zero/react";
import { schema, type Schema } from "../../../backend/src/db/zero-schema";

export function getZeroCache({ userId }: { userId: string }) {
  return new Zero({
    userID: userId,
    auth: () => undefined,
    server: import.meta.env.CLIENT_PUBLIC_SERVER,
    schema: schema,
    kvStore: "idb",
  });
}

export function useZ() {
  return useZero<Schema>();
}
