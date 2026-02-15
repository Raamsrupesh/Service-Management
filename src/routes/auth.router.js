import express from "express";
const app = express.Router();
import { registerController, loginController , verifyEmail, resendOTP} from "../controllers/auth.controller.js";

app.post("/register", registerController);
app.post("/verify-email", verifyEmail);
app.post("/login", loginController); // For all (officers, workers, users) category as well..
app.post("/resend-otp", resendOTP);
export default app;