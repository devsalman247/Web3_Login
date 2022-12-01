import { Router } from "express";
import userRoutes from "./user";

const router = Router();

export default router.use("/user", userRoutes);
