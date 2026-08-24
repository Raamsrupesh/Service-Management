import { pgTable, serial, text, timestamp, varchar, integer, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const service_category = pgEnum("service_type", ['DRAINAGE CLEANER', 'SWEEPER', 'PLUMBER', 'ELECTRICIAN', 'MASON']);

export const servicesTable = pgTable("servicesTable", {
    id: serial("service").primaryKey(),
    user: integer("user").references(()=>usersTable.id).notNull(),
    status: varchar({length:20}).default("PENDING").notNull(),
    service_type: service_category("service_type").notNull(),
    desc: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    address:text().notNull().unique(),
    assigned_worker_id: integer().default(null),//.references(()=>workerTable.id);
    phno:varchar({length:12}).notNull().unique(),
    image_url: varchar({length : 200}).notNull(),
    landmark:varchar({length:60}),
    updated_at: timestamp().notNull().$onUpdate(() => new Date())
});