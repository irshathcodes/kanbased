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

  updateNote: async (c) => {
    const authCtx = c.var.authCtx;
    const noteId = c.req.valid("param").noteId;
    const body = c.req.valid("json");

    const note = await noteUseCases.updateNote(authCtx, noteId, body);

    return c.json(note, HTTP_STATUS_CODES.OK);
  },

  getNote: async (c) => {
    const authCtx = c.var.authCtx;
    const noteId = c.req.valid("param").noteId;

    const note = await noteUseCases.getNote(authCtx, noteId);

    return c.json(note, HTTP_STATUS_CODES.OK);
  },
}

export default handlers;