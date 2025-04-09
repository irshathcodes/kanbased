import { createSchemaFactory } from "drizzle-zod";
import * as schema from "./schema/index.js";

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
  coerce: {
    date: true
  }
});

export const zodDbSchema = {
  tasksTable: {
    insert: createInsertSchema(schema.tasksTable),
    select: createSelectSchema(schema.tasksTable),
  },
  taskMarkdownTable: {
    insert: createInsertSchema(schema.taskMarkdownTable),
    select: createSelectSchema(schema.taskMarkdownTable),
  },
  notesTable: {
    insert: createInsertSchema(schema.notesTable),
    select: createSelectSchema(schema.notesTable),
  },
  boardsTable: {
    insert: createInsertSchema(schema.boardsTable),
    select: createSelectSchema(schema.boardsTable),
  },
  columnsTable: {
    insert: createInsertSchema(schema.columnsTable),
    select: createSelectSchema(schema.columnsTable),
  },
} as const;
