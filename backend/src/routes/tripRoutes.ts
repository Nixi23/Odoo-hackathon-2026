// src/routes/tripRoutes.ts
import { Router } from 'express';
import { 
  getTrips, 
  getTripById, 
  createTrip, 
  updateTrip, 
  deleteTrip, 
  cloneTrip,
  saveStops
} from '../controllers/tripController';
import { authenticateUser, optionalAuthenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticateUser, getTrips);
router.get('/:id', optionalAuthenticate, getTripById);
router.post('/', authenticateUser, createTrip);
router.put('/:id', authenticateUser, updateTrip);
router.delete('/:id', authenticateUser, deleteTrip);
router.post('/:id/clone', authenticateUser, cloneTrip);

// Stops bulk synchronization
router.put('/:tripId/stops', authenticateUser, saveStops);

export default router;
