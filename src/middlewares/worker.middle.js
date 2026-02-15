export async function workerMiddleWare(req, res,next) {
    if(req.user.role !== "WORKER"){
        return res.status(400).json({msg:"You aren't an authorized worker!"});
    }
    next();
}