import { eq, or } from "drizzle-orm";
import db from "../config/db.js";
import { usersTable } from "../models/user.model.js";
import  argon  from "argon2";

export async function hashingInserstedPswd(req, res) {
    const employees = await db.select().from(usersTable).where(or(eq(usersTable.role, "ADMIN"),eq(usersTable.role, "WORKER"), eq(usersTable.role, "OFFICER")));
    for (let index = 0; index < employees.length; index++) {
        const element = employees[index];
        if(!element['password'].startsWith("$argon")){
            await db.update(usersTable).set({password: await argon.hash(element['password'])}).where(eq(usersTable.id, element['id']));
        }
    }
    return res.status(200).send({msg:"updated the passwords successfully!!"});
}