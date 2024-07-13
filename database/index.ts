/**
 * The ORM we use is drizzle-orm. We export our default database management object
 */
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";

const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

export default db;