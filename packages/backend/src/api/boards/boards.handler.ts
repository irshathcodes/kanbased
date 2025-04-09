import { HTTP_STATUS_CODES } from "../../lib/constants.js";
import type { InferHandlers } from "../../lib/types.js";
import type routes from "./boards.routes.js";
import * as boardsUseCases from "../../use-cases/boards.js";
import * as columnsUseCases from "../../use-cases/columns.js";
import * as tasksUseCases from "../../use-cases/tasks.js";
import { db } from "../../db/index.js";
import { getRandomId } from "../../lib/utils.js";

const handlers: InferHandlers<typeof routes> = {
  createBoard: async (c) => {
    const authCtx = c.var.authCtx;
    const body = c.req.valid("json");

    await boardsUseCases.createBoard(authCtx, body);

    return c.json({}, HTTP_STATUS_CODES.CREATED);
  },

  getBoards: async (c) => {
    const authCtx = c.var.authCtx;

    const boards = await boardsUseCases.getBoards(authCtx);

    return c.json(boards, HTTP_STATUS_CODES.OK);
  },

  toggleBoardDelete: async (c) => {
    const authCtx = c.var.authCtx;
    const { boardId } = c.req.valid("param");
    const body = c.req.valid("json");

    const updatedBoard = await boardsUseCases.toggleBoardDelete(
      authCtx,
      boardId,
      body.deleted
    );

    return c.json(
      {
        id: updatedBoard.id,
        name: updatedBoard.name,
        color: updatedBoard.color,
        boardUrl: updatedBoard.boardUrl,
      },
      HTTP_STATUS_CODES.OK
    );
  },

  editBoard: async (c) => {
    const authCtx = c.var.authCtx;
    const { boardId } = c.req.valid("param");
    const body = c.req.valid("json");

    await boardsUseCases.editBoard(authCtx, boardId, body);

    return c.json({}, HTTP_STATUS_CODES.OK);
  },

  importBoards: async (c) => {
    const authCtx = c.var.authCtx;
    const { boards } = c.req.valid("json");
    const nowDate = new Date();

    await db.transaction(async (tx) => {
      for (let board of boards) {
        const createdBoard = await boardsUseCases.createBoard(authCtx, {
          id: getRandomId(),
          name: board.boardName,
          createdAt: nowDate,
          updatedAt: nowDate,
          boardUrl: board.boardUrl,
        }, tx);

        for (let column of board.columns) {
          const createdColumn = await columnsUseCases.createColumn(authCtx, {
            id: getRandomId(),
            name: column.name,
            createdAt: nowDate,
            updatedAt: nowDate,
            boardId: createdBoard.id,
            position: column.position,
          }, tx);

          for (let task of column.tasks) {
            await tasksUseCases.createTask(authCtx, {
              id: getRandomId(),
              name: task.name,
              createdAt: nowDate,
              updatedAt: nowDate,
              position: task.position,
              columnId: createdColumn.id,
            }, tx);
          }
        }
      }
    });

    return c.json({}, HTTP_STATUS_CODES.OK);
  },
};

export default handlers;
