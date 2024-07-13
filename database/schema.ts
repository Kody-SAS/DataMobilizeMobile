/**
 * Here we define the schema for the different tables in the Expo SQLite
 * database
 */

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// EXAMPLE
export const users = sqliteTable("users", {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	age: integer('age'),
})