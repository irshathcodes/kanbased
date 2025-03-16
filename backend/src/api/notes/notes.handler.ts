import type { InferHandlers } from "../../lib/types.js";
import type routes from "./notes.route.js";
import * as noteUseCases from "../../use-cases/notes.js";
import { HTTP_STATUS_CODES } from "../../lib/constants.js";

const handlers: InferHandlers<typeof routes> = {
  createNote: async (c) => {
    const authCtx = c.var.authCtx;
    const body = c.req.valid("json");

    const note = await noteUseCases.createNote(authCtx, body);

    return c.json(note, HTTP_STATUS_CODES.CREATED);
  },
}

export default handlers;