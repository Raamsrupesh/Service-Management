import { otpsTable } from "../models/otp.model";
import db from "./db";
import { gt } from "drizzle-orm";


async function autoDeleteOTPS() {
    const time = new Date();
    await db.delete(otpsTable).where(gt(time, otpsTable.expires_at));
    return "Auto Deleted OTPs!!";
}

export default autoDeleteOTPS;
