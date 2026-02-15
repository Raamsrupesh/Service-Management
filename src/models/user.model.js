import { serial, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("usersTable", {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: varchar({length: 10}).default("USER").notNull(),
  password: text().notNull(),
  email_verified_at: timestamp("email_verified_at").default(null),
  phno: varchar({length:10}).notNull().unique(),
  address: text().notNull().unique(),
  dno: varchar({length:10}).notNull().unique(),
  landmark: varchar({length:60})
});

