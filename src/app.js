import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.router.js';
import userRoutes from "./routes/user.router.js";
import officerRoutes from './routes/officer.routes.js';
import workerRoutes from './routes/worker.router.js';
import adminRoutes from './routes/admin.router.js';
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/v1", authRoutes);
app.use("/api/user/v1", userRoutes);
app.use("/api/officer/v1", officerRoutes);
app.use("/api/worker/v1", workerRoutes);
app.use("/api/admin/v1", adminRoutes);

app.get("/", async (req, res) => {
    res.status(200).send(`<h1 style="font-family: 'Segoe UI Semibold', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 2.5rem; font-weight: 600; line-height: 1.2; margin: 0 0 1rem 0;text-align:center;">🙏 🙏 Hari Hari 🙏 🙏</h1>`)
})

export default app;