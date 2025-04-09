import { createRoute } from "@hono/zod-openapi";

import {
  emptyResponse,
  jsonContent,
  jsonContentRequired,
} from "../../lib/schema-helpers.js";
import { HTTP_STATUS_CODES } from "../../lib/constants.js";
import z from "zod";
import { ResponseBuilder } from "../../lib/response-builder.js";
import { zodDbSchema } from "../../db/zod-db-schema.js";

const columnsInsertSchema = zodDbSchema.columnsTable.insert.omit({
  deletedAt: true,
});
const columnsSelectSchema = zodDbSchema.columnsTable.select.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

const getColumnsResponseSchema = z.object({
  boardId: z.string(),
  boardName: z.string(),
  columns: z.array(columnsSelectSchema),
  tasks: z.array(
    zodDbSchema.tasksTable.select.omit({
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    })
  ),
});

const updateColumnsReqBodySchema = z
  .array(columnsSelectSchema.pick({ id: true, position: true }))
  .nonempty();
export type GetColumnsResponse = z.infer<typeof getColumnsResponseSchema>;

const routes = {
  createColumn: createRoute({
    method: "post",
    path: "/columns",
    request: {
      body: jsonContentRequired(columnsInsertSchema),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.CREATED]: jsonContent(emptyResponse),
    }),
  }),

  reorderColumns: createRoute({
    method: "patch",
    path: "/columns/reorder",
    request: {
      body: jsonContentRequired(updateColumnsReqBodySchema),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(emptyResponse),
    }),
  }),

  getColumns: createRoute({
    method: "get",
    path: "/columns",
    request: {
      query: z.object({ boardUrl: z.string() }),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(getColumnsResponseSchema),
    }),
  }),

  updateColumnName: createRoute({
    method: "patch",
    path: "/columns/{columnId}",
    request: {
      params: z.object({ columnId: z.string() }),
      body: jsonContentRequired(columnsSelectSchema.pick({ name: true })),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(
        columnsSelectSchema.pick({ id: true, name: true })
      ),
    }),
  }),

  deleteColumn: createRoute({
    method: "delete",
    path: "/columns/{columnId}",
    request: {
      params: z.object({ columnId: z.string() }),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(emptyResponse),
    }),
  }),
};

export default routes;
