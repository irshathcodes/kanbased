import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTP_STATUS_CODES } from "./constants.js";
import type { AppBindings } from "./types.js";
import { verifySessionMiddleware, authenticatedMiddleware } from "../middlewares/auth.middleware.js";
export function createRouter() {
  const router = new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            success: result.success,
            error: result.error,
          },
          HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY
        );
      }
    },
  });

  return router;
}

export function createAuthenticatedRouter() {
  const router = createRouter();
  router.use(verifySessionMiddleware, authenticatedMiddleware);
  return router;
}