import express from "express";
import authRoutes from './routes/auth.router.js';
import userRoutes from "./routes/user.router.js";
import officerRoutes from './routes/officer.routes.js';
import workerRoutes from './routes/worker.router.js';
import adminRoutes from './routes/admin.router.js';
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api/admin", adminRoutes);

export default app;