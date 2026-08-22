// src/routes/adminRoutes.ts
import { Router } from 'express';
import { getAdminStats } from '../controllers/adminController';
import { authenticateUser, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticateUser, requireAdmin, getAdminStats);

export default router;
