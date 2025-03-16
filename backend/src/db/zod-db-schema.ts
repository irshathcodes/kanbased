import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as schema from "./schema/index.js";

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
} as const;
