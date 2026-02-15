import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const workersTable = pgTable("workersTable",{
    id : serial().primaryKey(),
    user: integer().references(()=>usersTable.id).notNull(),
    service_category:varchar({length:50}).notNull(),
    aadhar_number: varchar({length:14}).notNull().default("123456789011"),
    employment_type: varchar({length:30}).default("CONTRACT BASES").notNull(),
    updated_at:timestamp().$onUpdate(() => new Date())
})