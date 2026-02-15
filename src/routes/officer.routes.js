import express from "express";
const app = express.Router();
import {acceptingUserRequest, queryUserRequests, getUserRequests, rejectingUserRequest, assigingUserRequest, approvingRequest} from '../controllers/officer.controller.js';
import {userMiddleWare} from '../middlewares/auth.middle.js';
import {officerMiddleWare} from '../middlewares/officer.mid.js'

app.use("/",userMiddleWare);
app.use("/",officerMiddleWare);

app.patch("/requests/:id", getUserRequests);
app.patch("/requests/:id/accept", acceptingUserRequest);
app.patch("/requests/:id/reject", rejectingUserRequest);
app.patch("/requests/:id/assign", assigingUserRequest);
app.patch("/requests/:id/approve", approvingRequest);
app.get("/requests", queryUserRequests);


// app.get("/officer/allWorkers", getAllWorkers);
export default app;