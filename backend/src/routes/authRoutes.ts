// src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login, me } from '../controllers/authController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateUser, me);

export default router;
