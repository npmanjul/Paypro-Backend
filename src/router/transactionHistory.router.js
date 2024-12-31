import { Router } from 'express';
import { getAllTransactions } from '../controller/transactionHistory.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.route('/:userId').get(authMiddleware,getAllTransactions);

export default router;