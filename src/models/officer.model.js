import { serial, pgTable, varchar, text, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const officersTable = pgTable("officersTable", {
  id: serial().primaryKey(),
  user: integer().references(()=>usersTable.id).notNull(),
  aadhar: text().default("1234567890111").notNull(),
  department: varchar({length: 30}).default("Backend").notNull(),
  office_location:varchar({length:250}).default("Core Branch").notNull()
});