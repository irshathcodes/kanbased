import { createAuthenticatedRouter } from "../../lib/router.js";
import { registerRouteHandlers } from "../../lib/utils.js";
import routes from "./tasks.routes.js";
import handlers from "./tasks.handler.js";

const tasksRouter = createAuthenticatedRouter();

registerRouteHandlers(tasksRouter, routes, undefined, handlers);

export default tasksRouter;
