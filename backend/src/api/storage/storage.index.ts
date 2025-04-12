import { createAuthenticatedRouter } from "../../lib/router.js";
import { registerRouteHandlers } from "../../lib/utils.js";
import handlers from "./storage.handler.js";
import routes from "./storage.routes.js";

const router = createAuthenticatedRouter();
registerRouteHandlers(router, routes, {}, handlers);

export default router; 