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
    
    if(!req.file){
        return res.status(400).json({msg : "No completion photo found!! Please upload photo showing work is completed."});
    }
    
    const service = await db.select().from(servicesTable).where(eq(servicesTable.id, id));
    if(service.length === 0){
        return res.status(404).json({msg:"Service request not found!"});
    }
    
    if(service[0].assigned_worker_id !== req.user.id){
        return res.status(403).json({msg:"You are not assigned to this service!"});
    }
    
    await db.update(servicesTable).set({
        status:"COMPLETED",
        completion_image_url: req.file.path
    }).where(eq(servicesTable.id, id));
    
    return res.status(200).json({msg:"Task completed successfully!", completion_image_url: req.file.path});
}

export async function getWorkerProfile(req, res) {
    const [workerDet] = await db.select().from(usersTable).leftJoin(workersTable, eq(usersTable.id, workersTable.user));
    return res.status(200).json({details:{...workerDet['usersTable'], ...workerDet['workersTable']}});
}

