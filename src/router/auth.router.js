import { Router } from 'express';
import { login, signup, updatePin, verifyPin } from '../controller/auth.controller.js';
import { loginSchema, signupSchema } from '../validation/auth.validation.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validationMiddleware from '../middleware/validation.middleware.js';

const router = Router();

// User Authentication
router.route('/login').post(login);
router.route('/signup').post(validationMiddleware(signupSchema),signup);

//PIN
router.route('/verifypin').post(authMiddleware,verifyPin);
router.route('/updatepin').patch(authMiddleware,updatePin);

export default router;