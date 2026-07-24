import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { register, login } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));
