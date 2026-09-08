import { Router } from 'express';
import {
  createTransaction,
  getUserTransactions,
  getTransactionById,
  analyzeRiskOnly,
  getPendingApprovals,
  approveTransaction,
  blockTransaction
} from '../controllers/transactionController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRoles } from '../middleware/roleMiddleware';

const router = Router();

// Elderly User / General Transaction endpoints
router.post('/', authenticateToken, createTransaction);
router.get('/', authenticateToken, getUserTransactions);
router.post('/:id/analyze', authenticateToken, analyzeRiskOnly);

// Guardian Action routes
router.get('/guardian/pending', authenticateToken, requireRoles('GUARDIAN', 'ADMIN'), getPendingApprovals);
router.post('/guardian/transactions/:id/approve', authenticateToken, requireRoles('GUARDIAN', 'ADMIN'), approveTransaction);
router.post('/guardian/transactions/:id/block', authenticateToken, requireRoles('GUARDIAN', 'ADMIN'), blockTransaction);

// Single transaction fetch
router.get('/:id', authenticateToken, getTransactionById);

export default router;
