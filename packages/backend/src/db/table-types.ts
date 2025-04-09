import * as schema from "./schema/index.js";
import { Table } from "drizzle-orm";

/**
 * Utility type that extracts the SELECT type from a Drizzle table.
 * 
 * @template T - The table name from the schema (must be a valid table name from schema)
 * 
 * @example
 * // Use directly in function return type
 * function getBoard(): Promise<SelectType<'boardsTable'>> {
 *   // Type-safe board retrieval
 * }
 * 
 * // Use in variables
 * const board: SelectType<'boardsTable'> = await getBoard();
 */
export type SelectType<T extends keyof typeof schema> = (typeof schema)[T] extends Table
  ? (typeof schema)[T]['$inferSelect']
  : never;

/**
 * Utility type that extracts the INSERT type from a Drizzle table.
 * 
 * @template T - The table name from the schema (must be a valid table name from schema)
 * 
 * @example
 * // Use directly in function parameters
 * function createBoard(data: InsertType<'boardsTable'>) {
 *   // Type-safe board creation
 * }
 * 
 * // Use in variables
 * const newBoard: InsertType<'boardsTable'> = {
 *   // Type-safe board data
 * };
 */
export type InsertType<T extends keyof typeof schema> = (typeof schema)[T] extends Table
  ? (typeof schema)[T]['$inferInsert']
  : never;
