export async function officerMiddleWare(req, res, next) {
    const {role} = req.user;
    if(role !== "OFFICER"){
        return res.status(400).json({msg:"You are not officer!!"});
    } 
    next();
}