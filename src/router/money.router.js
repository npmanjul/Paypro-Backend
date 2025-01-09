import { Router } from 'express';
import { accountDetails, addAmount, transferAmount } from '../controller/money.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.route('/addAmount').post(authMiddleware,addAmount);
router.route('/accountdetail').post(authMiddleware,accountDetails);
router.route('/transferAmount').post(authMiddleware,transferAmount);


export default router; 