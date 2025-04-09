import { createRoute, z } from "@hono/zod-openapi";

import {
  emptyResponse,
  genericMessageContent,
  jsonContent,
  jsonContentRequired,
} from "../../lib/schema-helpers.js";
import { HTTP_STATUS_CODES } from "../../lib/constants.js";
import { ResponseBuilder } from "../../lib/response-builder.js";
import { zodDbSchema } from "../../db/zod-db-schema.js";

const createBoardParamsSchema = zodDbSchema.boardsTable.insert.omit({
  organizationId: true,
});

const createBoardResponse = zodDbSchema.boardsTable.select.omit({
  organizationId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

const importBoardsBodySchema = z.object({
  boards: z.array(z.object({
    boardName: z.string(),
    boardUrl: z.string(),
    columns: z.array(
      zodDbSchema.columnsTable.insert.pick({ name: true, position: true })
        .extend({
          tasks: z.array(
            zodDbSchema.tasksTable.insert.pick({
              columnId: true,
              name: true,
              position: true,
            })
          ),
        })
    ),
  }))
})

const routes = {
  createBoard: createRoute({
    method: "post",
    path: "/boards",
    request: {
      body: jsonContentRequired(createBoardParamsSchema),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.CREATED]: jsonContent(emptyResponse),
      [HTTP_STATUS_CODES.BAD_REQUEST]: genericMessageContent,
    }),
  }),

  getBoards: createRoute({
    method: "get",
    path: "/boards",
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(
        z.array(
          createBoardResponse.extend({
            tasksCount: z.number(),
            columnsCount: z.number(),
          })
        )
      ),
    }),
  }),

  toggleBoardDelete: createRoute({
    method: "patch",
    path: "/boards/{boardId}/toggle-delete",
    request: {
      params: z.object({ boardId: z.string() }),
      body: jsonContentRequired(z.object({ deleted: z.boolean() })),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(createBoardResponse),
    }),
  }),

  editBoard: createRoute({
    method: "patch",
    path: "/boards/{boardId}",
    request: {
      params: z.object({ boardId: z.string() }),
      body: jsonContentRequired(
        createBoardParamsSchema.omit({ id: true, createdAt: true })
      ),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(emptyResponse),
      [HTTP_STATUS_CODES.BAD_REQUEST]: genericMessageContent,
      [HTTP_STATUS_CODES.NOT_FOUND]: genericMessageContent,
    }),
  }),

  importBoards: createRoute({
    method: "post",
    path: "/boards/import",
    request: {
      body: jsonContentRequired(importBoardsBodySchema),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(emptyResponse),
    }),
  }),
};

export default routes;
