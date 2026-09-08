import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  topupWallet,
  requestFundsFromGuardian,
  getPendingFundRequests,
  approveFundRequest,
  rejectFundRequest
} from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/topup', authenticateToken, topupWallet);

// Guardian Allowance / Fund Request Routes
router.post('/request-funds', authenticateToken, requestFundsFromGuardian);
router.get('/fund-requests/pending', authenticateToken, getPendingFundRequests);
router.post('/fund-requests/:id/approve', authenticateToken, approveFundRequest);
router.post('/fund-requests/:id/reject', authenticateToken, rejectFundRequest);

export default router;
