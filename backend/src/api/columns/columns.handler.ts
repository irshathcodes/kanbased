import { type GetColumnsResponse } from "./columns.routes.js";
import { HTTP_STATUS_CODES } from "../../lib/constants.js";
import type { InferHandlers } from "../../lib/types.js";
import type routes from "./columns.routes.js";
import * as columnsUseCases from "../../use-cases/columns.js";

const handlers: InferHandlers<typeof routes> = {
  createColumn: async (c) => {
    const authCtx = c.var.authCtx;
    const body = c.req.valid("json");

    await columnsUseCases.createColumn(authCtx, body);

    return c.json({}, HTTP_STATUS_CODES.CREATED);
  },

  reorderColumns: async (c) => {
    const authCtx = c.var.authCtx;
    const columns = c.req.valid("json");

    await columnsUseCases.reorderColumns(authCtx, columns);

    return c.json({}, HTTP_STATUS_CODES.OK);
  },

  getColumns: async (c) => {
    const authCtx = c.var.authCtx;
    const params = c.req.valid("query");

    const { columns, tasks, boardId, boardName } = await columnsUseCases.getColumnsAndTasks(authCtx, params.boardUrl);

    const response: GetColumnsResponse = {
      boardId,
      columns,
      boardName,
      tasks,
    };

    return c.json(response, HTTP_STATUS_CODES.OK);
  },

  updateColumnName: async (c) => {
    const authCtx = c.var.authCtx;
    const { columnId } = c.req.valid("param");
    const body = c.req.valid("json");

    const updatedCol = await columnsUseCases.updateColumnName(authCtx, columnId, body);

    return c.json({ id: updatedCol.id, name: updatedCol.name }, HTTP_STATUS_CODES.OK);
  },

  deleteColumn: async (c) => {
    const authCtx = c.var.authCtx;
    const { columnId } = c.req.valid("param");

    await columnsUseCases.deleteColumn(authCtx, columnId);

    return c.json({}, HTTP_STATUS_CODES.OK);
  },
};

export default handlers;
