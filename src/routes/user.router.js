import express from "express";
const app = express.Router();
import {getAllServices, newServiceRequest, getProfile, nameAndOthersEdit, sendOTPToEEAndInsertOtpinDB,verifyingEditedEmail,editPassword, giveFeed, cancelRequest, getAssignedWorkerDet} from "../controllers/user.controller.js";
import {userMiddleWare,} from "../middlewares/auth.middle.js";
import upload from '../middlewares/multer.js'

app.use("/", userMiddleWare);

app.get("/profile", getProfile);
app.patch("/profile/naoedit", nameAndOthersEdit);
app.post("/profile/edit/email", sendOTPToEEAndInsertOtpinDB);
app.patch("/profile/edit/verify-email", verifyingEditedEmail);
app.patch("/profile/edit/password", editPassword);
app.post("/services/request", upload.single("image"), newServiceRequest);
app.get("/services/all", getAllServices);
app.post("/services/feed/:service_id", giveFeed);
app.get("/services/cancel/:service_id", cancelRequest);
app.get("/services/worker_det/:service_id", getAssignedWorkerDet);

export default app;