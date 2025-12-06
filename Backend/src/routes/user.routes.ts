import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../validations/auth.validations';
import asyncHandler from '../middleware/asyncHandler.middleware';

const router = Router();

router.post('/register', asyncHandler(validate(registerSchema)), register);
router.post('/login', validate(loginSchema), login);

export default router;
