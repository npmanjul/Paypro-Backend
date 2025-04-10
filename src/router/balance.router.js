import { Router } from "express";
import { getBalance } from "../controller/balance.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.route("/:userId").get(authMiddleware, getBalance);

export default router;
