import jwt from 'jsonwebtoken';
import "dotenv/config";

export async function userMiddleWare(req, res, next) {
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(409).json({msg: "You are not authorized!!"});
    }
    if(authorization.split(" ")[0] != "Bearer"){
        return res.status(409).json({msg: "The authorization should start with Bearer!!"});
    }
    const token = authorization.split(" ")[1];
    // if(token === "ADMIN"){
    //     req.user = {role:"ADMIN"};
    //     return next();
    // }
    if(!token){
        return res.status(400).json({msg: "No Token exists!!"});
    }
    const payLoad = await jwt.verify(token, process.env.JWT_TOKEN);
    if(!payLoad){
        return res.status(400).json({msg: "Invalid Token exists!!"});
    }
    req.user = payLoad;
    next();
}