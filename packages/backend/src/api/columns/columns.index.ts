import { createAuthenticatedRouter } from "../../lib/router.js";
import { registerRouteHandlers } from "../../lib/utils.js";
import routes from "./columns.routes.js";
import handlers from "./columns.handler.js";

const columnsRouter = createAuthenticatedRouter();

registerRouteHandlers(columnsRouter, routes, undefined, handlers);

export default columnsRouter;
