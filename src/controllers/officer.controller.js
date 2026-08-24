import { eq, desc, asc } from 'drizzle-orm';
import db from '../config/db.js';
import {servicesTable} from '../models/services.model.js';
import { usersTable } from '../models/user.model.js';
import { workersTable } from '../models/workers.model.js';

export async function acceptingUserRequest(req, res) {
    const {id} = req.params;
    await db.update(servicesTable).set({status: "ACCEPTED"}).where(eq(servicesTable.id, id));
    return res.status(200).json({msg:"Accepted the request!!"});
}

export async function rejectingUserRequest(req, res) {
    const {id} = req.params;
    await db.update(servicesTable).set({status: "REJECTED"}).where(eq(servicesTable.id, id));
    return res.status(200).json({msg:"Rejected the request!!"});
}

export async function queryUserRequests(req, res) {
    const {status} = req.query;
    const [results] = await db.select().from(servicesTable).where(eq(servicesTable.status, status));
    return res.status(200).json({msg:"Successfully fetched!", results})
}

export async function assigingUserRequest(req, res) {
    const {workerId} = req.body;
    const {id} = req.params;
    await db.update(servicesTable).set({status: "ASSIGNED", assigned_worker_id:workerId}).where(eq(servicesTable.id,id));
    return res.status(200).json({msg: `Assigned to the worker whose Id is: ${workerId}`});
}

export async function getUserRequests(req, res) {
    const {id} = req.params;
    const [userReqs] = await db.select().from(servicesTable).where(eq(servicesTable.id, id)).orderBy(asc(servicesTable.date));
    return res.status(200).json({msg:userReqs});
}

export async function approvingRequest(req, res) {
    const[curMode]= await db.update(servicesTable).set({status:"APPROVED"}).where(eq(servicesTable.id, req.params.id)).returning({mode:servicesTable.status});
    return res.status(200).json({msg:`Successfully, Changed the mode to '${curMode.mode}'`});
}

export async function queryUserServiceRequests(req, res) {
    const {service} = req.query;
    const servicequery = await db.select().from(servicesTable).where(eq(servicesTable.service_type, service));
    return res.status(200).json({service, results:servicequery});
}

export async function queryWorkerServices(req, res) {
    const {service} = req.query;
    const servicecategory = await db.select().from(workersTable).where(eq(workersTable.service_category, service));
    return res.status(200).json({service, results:servicecategory})
}

export async function getAllWorkers(req, res) {
    const {page, limit} = req.query;
    const offset = (page - 1) * limit; 
    const allWorkers = await db.select().from(usersTable).innerJoin(workersTable, eq(usersTable.id, workersTable.user)).limit(limit).offset(offset);
    return res.status(200).json({allWorkers});
}