import { pgTable, serial, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const servicesTable = pgTable("servicesTable", {
    id: serial("service").primaryKey(),
    user: integer("user").references(()=>usersTable.id).notNull(),
    status: varchar({length:20}).default("PENDING").notNull(),
    service_type: varchar({length:20}).notNull(),
    desc: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    address:text().notNull().unique(),
    assigned_worker_id: integer().default(null),//.references(()=>workerTable.id);
    phno:varchar({length:12}).notNull().unique(),
    landmark:varchar({length:60}),
    updated_at: timestamp().notNull().$onUpdate(() => new Date())
});