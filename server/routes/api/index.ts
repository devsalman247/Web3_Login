import { Router } from "express";
import { user } from "./user.ts";

const router = Router();

export default router.use("/user", user);
