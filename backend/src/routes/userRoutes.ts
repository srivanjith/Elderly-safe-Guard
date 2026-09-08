import { Router } from 'express';
import { getProfile, updateProfile, topupWallet } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/topup', authenticateToken, topupWallet);

export default router;
