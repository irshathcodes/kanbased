import { createAuthenticatedRouter } from "../../lib/router.js";
import { registerRouteHandlers } from "../../lib/utils.js";
import routes from "./notes.route.js";
import handlers from "./notes.handler.js";

const router = createAuthenticatedRouter();

registerRouteHandlers(router, routes, undefined, handlers);

export default router;
