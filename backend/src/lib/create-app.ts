import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";

import { env } from "../env.js";
import { pinoLogger } from "./pino-logger.js";
import { HTTP_STATUS_CODES, HTTP_STATUS_PHRASES } from "./constants.js";
import { PermissionError, UnprocessableEntityError } from "./error-utils.js";
import type { StatusCode } from "hono/utils/http-status";
import type { AppBindings } from "./types.js";

export default function createApp() {
  const appRouter = new OpenAPIHono<AppBindings>();

  appRouter.use(
    "/*",
    cors({
      origin: env.FE_ORIGIN,
      credentials: true,
    })
  );

  appRouter.use(csrf({ origin: env.FE_ORIGIN }));
  appRouter.use(pinoLogger());


  appRouter.notFound((c) => {
    return c.json(
      {
        message: `${HTTP_STATUS_PHRASES.NOT_FOUND} - ${c.req.path}`,
      },
      HTTP_STATUS_CODES.NOT_FOUND
    );
  });

  appRouter.onError((err, c) => {
    const isDevelopment = env.NODE_ENV !== "production";
    let statusCode: StatusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    let message =
      "An unexpected error occurred, Please contact support if the problem persists.";

    if (err instanceof PermissionError) {
      statusCode = HTTP_STATUS_CODES.FORBIDDEN;
      message = err.message;
    }

    if (err instanceof UnprocessableEntityError) {
      statusCode = HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY;
      message = err.message;
    }

    const data = {
      message,
      stack: err instanceof Error && isDevelopment ? err.stack : undefined,
      statusCode,
    };

    isDevelopment && c.var.logger.error(err);

    return c.json(data, statusCode);
  });

  return appRouter;
}
