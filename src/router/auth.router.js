import { Router } from 'express';
import { login, signup } from '../controller/auth.controller.js';
import validationMiddleware from '../middleware/validation.middleware.js';
import { loginSchema, signupSchema } from '../validation/auth.validation.js';

const router = Router();

router.route('/login').post(validationMiddleware(loginSchema),login);
router.route('/signup').post(validationMiddleware(signupSchema),signup);

export default router;