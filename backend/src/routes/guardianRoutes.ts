import { Router } from 'express';
import { addGuardian, getGuardians, removeGuardian } from '../controllers/guardianController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, addGuardian);
router.get('/', authenticateToken, getGuardians);
router.delete('/:id', authenticateToken, removeGuardian);

export default router;
