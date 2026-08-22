// src/routes/userRoutes.ts
import { Router } from 'express';
import { 
  updateProfile, 
  deleteAccount, 
  getSavedDestinations, 
  saveDestination, 
  unsaveDestination 
} from '../controllers/userController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.put('/profile', authenticateUser, updateProfile);
router.delete('/profile', authenticateUser, deleteAccount);
router.get('/saved-destinations', authenticateUser, getSavedDestinations);
router.post('/saved-destinations/:cityId', authenticateUser, saveDestination);
router.delete('/saved-destinations/:cityId', authenticateUser, unsaveDestination);

export default router;
