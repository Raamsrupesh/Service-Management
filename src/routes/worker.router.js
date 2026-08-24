import express from "express";
const app = express.Router();
import {userMiddleWare} from "../middlewares/auth.middle.js";
import {workerMiddleWare} from "../middlewares/worker.middle.js";
import {getAssignedRequests, getAssignedRequest, startingAssignedTask, completingAssignedTask, getWorkerProfile} from '../controllers/worker.controller.js'
import upload from '../middlewares/multer.js'

app.use("/", userMiddleWare);
app.use("/", workerMiddleWare);

app.get('/requests', getAssignedRequests); // Assigned to this particular user.
app.get('/requests/:id', getAssignedRequest); 
app.patch('/requests/:id/start', startingAssignedTask); 
app.patch('/requests/:id/complete', upload.single("completion_image"), completingAssignedTask); 
app.get('/profile', getWorkerProfile); 

export default app;