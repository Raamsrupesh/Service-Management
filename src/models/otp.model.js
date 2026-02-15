import { serial, uuid, pgTable, varchar, text, check, timestamp } from "drizzle-orm/pg-core";
import {usersTable} from "./user.model.js";
// import { sql } from "drizzle-orm";

export const otpsTable = pgTable("otpsTable", {
  id: uuid().primaryKey().defaultRandom(),
  user: serial().references(()=>usersTable.id),
  email: varchar({ length: 255 }).notNull().unique(),
  otp: text().notNull(),
  created_at: timestamp().notNull(),
  expires_at: timestamp().notNull()
})

//(t)=>({
//     otpcheck: check("otp_length_check", sql`${t.otp.length} ~ ${6}`)
// })

