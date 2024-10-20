import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { boardTable } from "../../db/schema/index.js";
import { createAuthenticatedRouter } from "../../lib/create-app.js";
import { createBoardRoute, getBoardsRoute } from "./boards.routes.js";

const boardsRouter = createAuthenticatedRouter();

boardsRouter.openapi(createBoardRoute, async (c) => {
  const body = await c.req.json();
  const user = c.get("user");

  try {
    const [board] = await db
      .insert(boardTable)
      .values({ name: body.name, color: body.color, userId: user.id })
      .returning();

    return c.json(board!, 200);
  }
  catch (err) {
    const isUniqueConstraintError
      = err && typeof err === "object" && "code" in err && err.code === "23505";

    if (isUniqueConstraintError) {
      return c.json({ message: "Board name must be unique" }, 400);
    }
  }

  return c.json({ message: "" }, 500);
});

boardsRouter.openapi(getBoardsRoute, async (c) => {
  const user = c.get("user");

  const res = await db
    .select()
    .from(boardTable)
    .where(eq(boardTable.userId, user.id));

  return c.json(res, 200);
});

export default boardsRouter;
