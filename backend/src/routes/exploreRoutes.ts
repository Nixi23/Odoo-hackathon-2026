// src/routes/exploreRoutes.ts
import { Router } from 'express';
import { getCities, getCityActivities } from '../controllers/exploreController';

const router = Router();

router.get('/cities', getCities);
router.get('/cities/:cityId/activities', getCityActivities);

export default router;
