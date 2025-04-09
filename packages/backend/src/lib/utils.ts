import type { Handler } from "hono";
import type { RouteConfig } from "@hono/zod-openapi";
import type { AppBindings } from "./types.js";
import type { InferHandlers, InferMiddlewares } from "./types.js";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { randomUUID } from "node:crypto";


/**
 * Register routes and their handlers to a router in a type-safe way
 * @param router - The router instance to register routes to
 * @param routes - The route definitions
 * @param middlewares - The middlewares for the routes
 * @param handlers - The handlers for the routes
 * 
 * @example
 * const router = createAuthenticatedRouter();
 * registerRouteHandlers(router, routes, middlewares, handlers);
 */
export function registerRouteHandlers<
  TRoutes extends Record<string, RouteConfig>
>(
  router: OpenAPIHono<AppBindings>,
  routes: TRoutes,
  middlewares: InferMiddlewares<TRoutes> = {},
  handlers: InferHandlers<TRoutes>
) {
  (Object.keys(routes) as Array<keyof TRoutes>).forEach((key) => {
    let routeConfig = routes[key]!;
    const middleware = middlewares[key];

    if (middleware?.length) {
      routeConfig = { ...routeConfig, middleware };
    }

    router.openapi(routeConfig, handlers[key] as Handler<AppBindings>);
  });
}

export function getRandomId() {
  return randomUUID()
}