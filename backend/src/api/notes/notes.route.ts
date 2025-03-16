import { createRoute } from "@hono/zod-openapi";
import { ResponseBuilder } from "../../lib/response-builder.js";
import { HTTP_STATUS_CODES } from "../../lib/constants.js";
import { jsonContent, jsonContentRequired } from "../../lib/schema-helpers.js";
import { zodDbSchema } from "../../db/zod-db-schema.js";

const createNoteSchema = zodDbSchema.notesTable.insert;
const noteResponseSchema = zodDbSchema.notesTable.select;

const routes = {
  createNote: createRoute({
    path: "/notes",
    method: "post",
    request: {
      body: jsonContentRequired(createNoteSchema)
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.CREATED]: jsonContent(noteResponseSchema)
    })
  })
}

export default routes;