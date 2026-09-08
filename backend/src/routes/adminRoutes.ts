import { Router } from 'express';
import { getAnalytics, getAllTransactions, getAllUsers } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRoles } from '../middleware/roleMiddleware';

const router = Router();

router.get('/analytics', authenticateToken, requireRoles('ADMIN'), getAnalytics);
router.get('/transactions', authenticateToken, requireRoles('ADMIN'), getAllTransactions);
router.get('/users', authenticateToken, requireRoles('ADMIN'), getAllUsers);

export default router;
