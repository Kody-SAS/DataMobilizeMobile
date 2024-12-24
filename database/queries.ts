/**
 * Queries on the database with 
 */
import db from ".";
import { users } from "./schema";


/**
 * Query to get all users from the database
 */
export function getAllUsers() {
    // querie example, selecting all users from the users table
    db.select().from(users)
}