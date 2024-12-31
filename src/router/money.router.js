import { Router } from 'express';
import { addAmount, transferAmount } from '../controller/money.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.route('/addAmount').post(authMiddleware,addAmount);
router.route('/transferAmount').post(authMiddleware,transferAmount);

export default router;