import db from "../config/db.js";
import { eq } from "drizzle-orm";
import jwt from 'jsonwebtoken'
import argon from 'argon2';
import {usersTable} from "../models/user.model.js";
import {otpsTable} from "../models/otp.model.js";
import {sendRegistrationEmail,sendEmail} from "../services/email.service.js";
import {isValidEmail} from '../utils/emailcheck.js';

export async function registerController(req, res, next) {
    try{
        const {name, email, password, dno, address, phno} = req.body;
        if(!isValidEmail(email)){
            return res.status(400).json({msg:"Not valid Email!"});
        }
        if(password.length < 6){
            return res.status(400).json({msg:"Not valid password!!"});
        }
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        const [actotp] = await db.select().from(otpsTable).where(eq(otpsTable.email,email))
        if(!user && !actotp){
            const hashedPassword = await argon.hash(password);
            const [newUser] = await db.insert(usersTable).values({
                name,
                email,
                password:hashedPassword,
                dno,
                address,
                phno
            }).returning({id:usersTable.id});
            const otp = Math.floor(Math.random()*1000000);
            const [newOTP] = await db.insert(otpsTable).values({
                user:newUser.id,
                email,
                otp,
                created_at: new Date(),
                expires_at: new Date(new Date().getTime() + 60 * 60 * 1000)
            }).returning({otp:otpsTable.otp});
            await sendEmail(email, "OTP Recieved from Govt. Services Management Team!", `The OTP which you recieved from Govt. Services Management Team is ${newOTP.otp}. And mind it don't share it to everyone and this is only valid for **1 minute** itself!!`)
            return res.status(200).json({msg:"OTP Sent Successfully!"});
        }
        if(user && actotp){
            return res.status(400).json({msg:"USER aldready exists Login to ENTER!"});
        }
        return res.status(409).json({msg:"Invalid Credentials!!"});
    }
    catch(err){
        console.error('RAW ERROR OBJECT:', err);
        res.status(400).json({ error: err.message });
    }
}

export async function verifyEmail(req, res, next) {
    const {email, otp} = req.body;
    const [newOTP] = await db.delete(otpsTable).where(eq(otpsTable.email, email)).returning({otp:otpsTable.otp});
    if(Number(newOTP.otp) === Number(otp)){
        await db.update(usersTable).set({email_verified_at:new Date()}).where(eq(usersTable.email, email));
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        const token = await jwt.sign({id:user.id, role:"USER"}, process.env.JWT_TOKEN, {expiresIn:"1d"});
        await sendRegistrationEmail(email, "Resident!!");
        res.cookie("token", token);
        return res.status(200).json({msg:"Email Verification Successfull!!!", token});
    }
    return res.status(400).json({msg:"Invalid Credentials!!"});
}

export async function resendOTP(req, res, next) {
    const {email} = req.body;
    await db.delete(otpsTable).where(eq(otpsTable.email, email));
    const otp = Math.floor(Math.random()*1000000);
    await db.insert(otpsTable).values({
        email,
        otp,
        created_at:new Date(),
        expires_at:new Date(new Date().getTime() + 60*60*1000)
    })
    await sendEmail(email, "OTP Recieved from Govt. Services Management Team!", `The OTP which you recieved from Govt. Services Management Team is ${otp}. And mind it don't share it to everyone and this is only valid for **1 minute** itself!!`)
    return res.status(200).json({msg: "OTP Sent Successfully!!"});
}

export async function loginController(req, res, next) {
    const {email, password} = req.body;
    if(!isValidEmail(email)){
        return res.status(400).json({msg:"Not valid email"});
    }
    if(password.length < 6){
        return res.status(400).json({msg:"Not valid password!!"});        
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if(!user){
        return res.status(404).json({msg:"User doesn't exists!!"});
    }
    const isVerified = await argon.verify(user.password, password)
    if(isVerified){
        if(!user.email_verified_at){
            return res.status(403).json({msg:"You are not authorized yet!!"});
        }
        const token = await jwt.sign({id:user.id, role:user.role},process.env.JWT_TOKEN, {expiresIn:"1d"});
        res.cookie("token", token);
        return res.status(200).json({msg:"User Logged IN!!", token});
    }
}
