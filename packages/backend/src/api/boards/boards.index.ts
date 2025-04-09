import routes from "./boards.routes.js";
import handlers from "./boards.handler.js";
import { registerRouteHandlers } from "../../lib/utils.js";
import { createAuthenticatedRouter } from "../../lib/router.js";

const boardsRouter = createAuthenticatedRouter();

registerRouteHandlers(boardsRouter, routes, undefined, handlers);

export default boardsRouter;
