export async function adminMiddleWare(req, res,next) {
    if(req.user.role !== "ADMIN"){
        return res.status(400).json({msg:"You aren't an authorized worker!"});
    }
    next();
}