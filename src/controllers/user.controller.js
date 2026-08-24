import { and, eq } from 'drizzle-orm';
import {usersTable,} from '../models/user.model.js';
import {sendEmail, sendRegistrationEmail} from "../services/email.service.js"
import argon from 'argon2';
import { otpsTable } from '../models/otp.model.js';
import db from '../config/db.js';
import { servicesTable } from '../models/services.model.js';
import { log } from 'node:console';
import {isValidEmail} from '../utils/emailcheck.js';

export async function getProfile(req, res) {
    const {user} = req;
    const [actUser] = await db.select().from(usersTable).where(eq(usersTable.id, user.id));
    if(!actUser){
        return res.status(404).json({msg:"No user exists in Database!!"});
    } 
    return res.status(200).json({msg:"User exists in Database!!", details:actUser});
}

export async function nameAndOthersEdit(req, res) {
    const {name, phno, address, dno, landmark} = req.body;
    await db.update(usersTable).set({name, phno, address, dno, landmark}).where(eq(usersTable.id, req.user.id))
    return res.status(200).json({msg: `Updated as per your request!!`});
}

export async function sendOTPToEEAndInsertOtpinDB(req, res) {
    const {email} = req.body;
    if(!isValidEmail(email)){
        return res.status(400).json({msg:"Not an valid email!"});
    }
    const{id} = req.user;
    await db.update(usersTable).set({email_verified_at:null}).where(eq(usersTable.id, id));
    const otp = Math.floor(Math.random()*1000000);
    await db.insert(otpsTable).values({
        email,
        otp,
        created_at:new Date(),
        expires_at:new Date(new Date().getTime()+60*60*1000)
    })
    await sendEmail(email, "OTP Recieved from Govt. Services Management Team!", `The OTP which you recieved from Govt. Services Management Team is <b>${otp}</b>. And mind it don't share it to everyone and this is only valid for <b>1 minute</b> itself!!`)
    return res.status(200).json({msg: "OTP Sent successfully!!"});
}

export async function verifyingEditedEmail(req, res) {
    const {email, otp} = req.body;
    if(!isValidEmail(email)){
        return res.status(400).json({msg:"Not an valid Email!"});
    }
    const {id} = req.user;
    if(!email || !otp){
        return res.status(400).json({msg:"Every field is need to be filled!!"});
    }
    const [actOtp] = await db.delete(otpsTable).where(eq(otpsTable.email, email)).returning({otp: otpsTable.otp});
    if(Number(actOtp.otp) === Number(otp)){
        await db.update(usersTable).set({email_verified_at:new Date(), email:email}).where(eq(usersTable.id, id));
        await sendRegistrationEmail(email, "Resident");
        return res.status(200).json({msg: "Edited Email Verification Successfull!!"});
    }
    return res.status(400).json({msg: "Invalid Credentials!!"});
}

export async function editPassword(req, res) {
    const {password} = req.body;
    if(password.length < 6){
        return res.status(400).json({msg:"Not a valid password!"});
    }
    const {id} = req.user;
    await db.update(usersTable).set({password: await argon.hash(password)}).where(eq(usersTable.id, id));
    return res.status(200).json({msg:"Successfully updated the password!!"});
}

export async function newServiceRequest(req, res) {
    const {id} = req.user;
    if(!req.file){
        return res.status(400).json({msg : "No file found!!"});
    }
    
    const {service_type, desc, address, phno} = req.body;
    const [service_req] = await db.insert(servicesTable).values({
        user:id,
        service_type:service_type,
        desc,
        address,
        phno,
        image_url: req.file.path
    }).returning();
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    const text = `Dear Resident,
    
        Thank you for submitting your service request. We have received your details and our team will review it shortly.
            
        Service Type: ${service_type}
        Description: ${desc}
            
        We appreciate your patience and will contact you soon with next steps or an estimated timeline.
            
        Best regards,
        Your Govt. Service Management Team.`
    await sendEmail(user.email, "Requested a service from Govt. Service Management!", text);
    return res.status(201).json({msg:"Created a Service Request!!", details:service_req});
}

export async function getAllServices(req, res) {
    const {id} = req.user;
    const [allServices] = await db.select().from(servicesTable).where(eq(servicesTable.user, id));
    return res.status(200).json({requests:allServices});
}

export async function giveFeed(req, res) {
    const {service_id} = req.params;
    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, service_id));
    if(service.status === "COMPLETED"||service.status === "APPROVED"){
        const{rating, desc} = req.body;
        log(`Thank you for giving us the rating: ${rating} and A brief description: ${desc}!!`);
        return res.status(200).json({msg:"Thank you for your feedback it means a lot for us!!"})
    }
    if(service.status !== "REJECTED" || service.status !== "CANCELLED"){
        return res.status(400).json({msg:"Thankyou, but the service is not yet completed!!"})
    }
    return res.status(400).json({msg:`Sorry, the service has been ${service.status}!`})
}

export async function cancelRequest(req, res) {
    const {service_id} = req.params;
    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, service_id));
    if(service.status === "PENDING" || service.status === "ASSIGNED" || service.status === "ACCEPTED"){
        await db.update(servicesTable).set({status:"CANCELLED"}).where(eq(servicesTable.id, service_id));
        return res.status(200).json({msg:"The service has been cancelled!!"});
    }
    return res.status(400).json({msg: `It can't be done since the service is ${service.status}!!`});
}

export async function getAssignedWorkerDet(req, res) {
    const {service_id} = req.params;
    
    const [det] = await db.select().from(servicesTable).where(and(eq(servicesTable.user, req.user.id), eq(servicesTable.id,service_id)));
    // const workersDet = alias(usersTable, "worker Details");
    
    if(det.status === "ASSIGNED" || det.status === "COMPLETED" || det.status === "IN PROGRESS"){
        const [workerDet] = await db.select().from(servicesTable).leftJoin(usersTable, eq(servicesTable.assigned_worker_id, usersTable.id));
        return res.status(200).json({details:{...workerDet['servicesTable'], ...workerDet['usersTable']}});
    }
    return res.status(400).json({details:"Not assigned yet!!"});
}