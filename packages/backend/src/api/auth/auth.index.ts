import { auth } from "../../lib/auth.js";
import { createRouter } from "../../lib/router.js";

const authRouter = createRouter();

authRouter.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

export default authRouter;
