import db from '../config/db.js';
import {servicesTable} from '../models/services.model.js';
import { eq, and } from 'drizzle-orm';
import { usersTable } from '../models/user.model.js';
import { workersTable } from '../models/workers.model.js';

export async function getAssignedRequests(req, res) {
    const [getAllReq] = await db.select().from(servicesTable).where(eq(servicesTable.assigned_worker_id, req.user.id));
    return res.status(200).json({allRequests:getAllReq});
}

export async function getAssignedRequest(req, res) {
    const {id} = req.params;
    const [getaReq] = await db.select().from(servicesTable).where(and(eq(servicesTable.assigned_worker_id, req.user.id),eq(servicesTable.id,id)));
    return res.status(200).json({Request:getaReq});
}

export async function startingAssignedTask(req, res) {
    const{id} = req.params;
    await db.update(servicesTable).set({status:"IN PROGRESS"}).where(eq(servicesTable.id, id));
    return res.status(200).json({msg:"Updated Successfully!"});
}

export async function completingAssignedTask(req, res) {
    const{id} = req.params;
    await db.update(servicesTable).set({status:"COMPLETED"}).where(eq(servicesTable.id, id));
    return res.status(200).json({msg:"Updated Successfully!"});
}

export async function getWorkerProfile(req, res) {
    const [workerDet] = await db.select().from(usersTable).leftJoin(workersTable, eq(usersTable.id, workersTable.user));
    return res.status(200).json({details:{...workerDet['usersTable'], ...workerDet['workersTable']}});
}

