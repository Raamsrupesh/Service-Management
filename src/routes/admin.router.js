import express from "express";
const app = express.Router();

import {adminMiddleWare} from '../middlewares/admin.middle.js'
import { hashingInserstedPswd } from "../controllers/admin.controller.js";
import {userMiddleWare} from '../middlewares/auth.middle.js'
app.post("/create-employee-pswd",userMiddleWare , adminMiddleWare, hashingInserstedPswd); // For all (officers, workers, users) category as well..

export default app;