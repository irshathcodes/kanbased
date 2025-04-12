import { createRoute } from "@hono/zod-openapi";
import { ResponseBuilder } from "../../lib/response-builder.js";
import { HTTP_STATUS_CODES } from "../../lib/constants.js";
import { jsonContent, jsonContentRequired } from "../../lib/schema-helpers.js";
import { zodDbSchema } from "../../db/zod-db-schema.js";
import { z } from "zod";

const createNoteSchema = zodDbSchema.notesTable.insert;
const noteResponseSchema = zodDbSchema.notesTable.select;

const routes = {
  createNote: createRoute({
    path: "/notes",
    method: "post",
    request: {
      body: jsonContentRequired(
        createNoteSchema.pick({
          name: true,
          content: true,
          createdAt: true,
          id: true,
        })
      ),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.CREATED]: jsonContent(noteResponseSchema),
    }),
  }),

  updateNote: createRoute({
    path: "/notes/{noteId}",
    method: "patch",
    request: {
      params: z.object({
        noteId: z.string().uuid(),
      }),
      body: jsonContent(
        createNoteSchema.pick({ content: true, updatedAt: true, name: true })
      ),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(noteResponseSchema),
    }),
  }),

  getNote: createRoute({
    path: "/notes/{noteId}",
    method: "get",
    request: {
      params: z.object({
        noteId: z.string().uuid(),
      }),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(noteResponseSchema),
    }),
  }),

  getAllNotes: createRoute({
    path: "/notes",
    method: "get",
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(z.object({ notes: z.array(noteResponseSchema.pick({ id: true, name: true, updatedAt: true, })) })),
    }),
  }),
};

export default routes;
