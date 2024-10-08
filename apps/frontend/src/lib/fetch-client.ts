import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "@/types/api-schema"; // generated by openapi-typescript

export const fetchClient = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const authMiddleware: Middleware = {
  async onResponse({ response }) {
    return undefined;
  },
};

fetchClient.use(authMiddleware);
