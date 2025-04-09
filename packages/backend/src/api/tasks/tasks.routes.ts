import z from "zod";
import { createRoute } from "@hono/zod-openapi";

import {
  emptyResponse,
  jsonContent,
  jsonContentRequired,
} from "../../lib/schema-helpers.js";
import { HTTP_STATUS_CODES } from "../../lib/constants.js";
import { ResponseBuilder } from "../../lib/response-builder.js";
import { zodDbSchema } from "../../db/zod-db-schema.js";

const createTaskBodySchema = zodDbSchema.tasksTable.insert;

const updateTasksSchema = z.array(
  createTaskBodySchema.pick({ position: true, columnId: true, id: true })
);

const getTaskDetailSchema = zodDbSchema.tasksTable.select.extend({
  content: z.string().nullable(),
})

const routes = {
  createTask: createRoute({
    method: "post",
    path: "/tasks",
    request: {
      body: jsonContentRequired(createTaskBodySchema),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(emptyResponse),
    }),
  }),

  updateTask: createRoute({
    method: "patch",
    path: "/tasks/{taskId}",
    request: {
      body: jsonContentRequired(
        z.object({
          name: z.string().optional(),
          content: z.string().nullable().optional(),
          updatedAt: z.string(),
        }).refine((data) => {
          if (data.name === undefined && data.content === undefined) {
            return false;
          }
          return true;
        }, {
          message: "At least one field must be provided for update",
        })
      ),
      params: z.object({ taskId: z.string() }),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(emptyResponse),
    }),
  }),

  updateTasksPosition: createRoute({
    method: "put",
    path: "/tasks",
    request: {
      body: jsonContentRequired(updateTasksSchema),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(emptyResponse),
    }),
  }),

  deleteTask: createRoute({
    method: "delete",
    path: "/tasks/{taskId}",
    request: {
      params: z.object({ taskId: z.string() }),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(emptyResponse),
    }),
  }),

  getTaskDetail: createRoute({
    method: "get",
    path: "/tasks/{taskId}",
    request: {
      params: z.object({ taskId: z.string() }),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(getTaskDetailSchema),
    }),
  }),
};

export default routes;
