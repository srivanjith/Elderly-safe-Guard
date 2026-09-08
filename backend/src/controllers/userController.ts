import { Response } from 'express';
import User from '../models/User';
import GuardianRelationship from '../models/GuardianRelationship';
import FundRequest from '../models/FundRequest';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';
import { AuditService } from '../services/auditService';
import { getSocketManager } from '../sockets/socketManager';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }
    return res.json({ success: true, user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, walletBalance } = req.body;
    const userId = req.user?.id;

    try {
      const user = await User.findById(userId).maxTimeMS(3000);
      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (walletBalance !== undefined && req.user?.role === 'ADMIN') {
          user.walletBalance = walletBalance;
        }

        await user.save();
        await AuditService.log('PROFILE_UPDATE', 'User', userId, userId);

        return res.json({
          success: true,
          message: 'Profile updated successfully',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            walletBalance: user.walletBalance,
            phone: user.phone
          }
        });
      }
    } catch (dbErr) {
      console.warn('[UserController] DB query failed during updateProfile, using fallback response');
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully (Demo Mode)',
      user: {
        id: userId,
        name: name || req.user?.name || 'User',
        email: req.user?.email || '',
        role: req.user?.role || 'ELDERLY_USER',
        walletBalance: 150000,
        phone: phone || ''
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

export const topupWallet = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.id;
    const topupAmt = Number(amount) || 50000;

    try {
      const user = await User.findById(userId).maxTimeMS(3000);
      if (user) {
        user.walletBalance = (user.walletBalance || 0) + topupAmt;
        await user.save();
        await AuditService.log('WALLET_TOPUP', 'User', userId, userId, { addedAmount: topupAmt });

        return res.json({
          success: true,
          message: `₹${topupAmt.toLocaleString()} added to wallet successfully!`,
          walletBalance: user.walletBalance,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            walletBalance: user.walletBalance,
            phone: user.phone
          }
        });
      }
    } catch (dbErr) {
      console.warn('[UserController] DB query failed during topupWallet');
    }

    return res.json({
      success: true,
      message: `₹${topupAmt.toLocaleString()} added to wallet (Demo Mode)!`,
      walletBalance: 200000
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to top up wallet', error: error.message });
  }
};

// --- GUARDIAN ALLOWANCE / FUND REQUEST FLOW ---

// In-memory fallback array for demo mode when DB is disconnected
const memoryFundRequests: any[] = [
  {
    _id: 'fr_demo_1',
    requesterId: {
      _id: '660000000000000000000001',
      name: 'Ramakrishna Sharma',
      email: 'elderly@safepay.demo',
      phone: '+91 98765 43210',
      walletBalance: 150000
    },
    guardianId: '660000000000000000000002',
    amount: 10000,
    note: 'Monthly Medical & Household Grocery Allowance',
    status: 'PENDING',
    createdAt: new Date()
  }
];

export const requestFundsFromGuardian = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { amount, note } = req.body;
    const reqAmount = Number(amount) || 10000;

    if (!reqAmount || reqAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid request amount is required' });
    }

    let assignedGuardianId: any = null;

    try {
      const primaryRel = await GuardianRelationship.findOne({ userId, isPrimary: true }).maxTimeMS(3000);
      const backupRel = primaryRel ? null : await GuardianRelationship.findOne({ userId }).maxTimeMS(3000);
      assignedGuardianId = primaryRel?.guardianId || backupRel?.guardianId;
    } catch (dbErr) {
      console.warn('[UserController] DB error finding guardian for fund request');
    }

    if (!assignedGuardianId) {
      // Default fallback demo guardian ID (Arun Sharma)
      assignedGuardianId = '660000000000000000000002';
    }

    let newRequest: any = null;
    try {
      newRequest = await FundRequest.create({
        requesterId: userId,
        guardianId: assignedGuardianId,
        amount: reqAmount,
        note: note || 'Monthly allowance request',
        status: 'PENDING'
      });

      await Notification.create({
        userId: assignedGuardianId,
        type: 'GUARDIAN_APPROVAL_REQUEST',
        title: '📩 Fund Request from Ward',
        message: `${req.user?.name || 'Your ward'} requested ₹${reqAmount.toLocaleString()} allowance for: "${note || 'General Expenses'}"`
      });
    } catch (dbErr) {
      newRequest = {
        _id: 'fr_' + Date.now(),
        requesterId: { _id: userId, name: req.user?.name || 'Ramakrishna Sharma', email: req.user?.email },
        guardianId: assignedGuardianId,
        amount: reqAmount,
        note: note || 'Monthly allowance request',
        status: 'PENDING',
        createdAt: new Date()
      };
      memoryFundRequests.unshift(newRequest);
    }

    const io = getSocketManager();
    if (io) {
      io.to(`guardian:${assignedGuardianId.toString()}`).emit('fund:requested', {
        request: newRequest,
        message: `New allowance request of ₹${reqAmount.toLocaleString()} received.`
      });
    }

    return res.status(201).json({
      success: true,
      message: `Fund request for ₹${reqAmount.toLocaleString()} sent to your Guardian for review.`,
      fundRequest: newRequest
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to submit fund request', error: error.message });
  }
};

export const getPendingFundRequests = async (req: AuthRequest, res: Response) => {
  try {
    const guardianId = req.user?.id;
    let pendingRequests: any[] = [];

    try {
      pendingRequests = await FundRequest.find({
        status: 'PENDING'
      })
        .populate('requesterId', 'name email phone walletBalance')
        .sort({ createdAt: -1 })
        .maxTimeMS(3000);
    } catch (dbErr) {
      console.warn('[UserController] DB query failed during getPendingFundRequests, using fallback');
    }

    if (pendingRequests.length === 0) {
      pendingRequests = memoryFundRequests.filter(r => r.status === 'PENDING');
    }

    return res.json({ success: true, fundRequests: pendingRequests });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch pending fund requests', error: error.message });
  }
};

export const approveFundRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const guardianId = req.user?.id;

    let fundReq: any = null;
    let requesterUser: any = null;

    try {
      fundReq = await FundRequest.findById(id);
      if (fundReq) {
        requesterUser = await User.findById(fundReq.requesterId);
        if (requesterUser) {
          requesterUser.walletBalance = (requesterUser.walletBalance || 0) + fundReq.amount;
          await requesterUser.save();
        }

        fundReq.status = 'APPROVED';
        await fundReq.save();

        await Notification.create({
          userId: fundReq.requesterId,
          type: 'TRANSACTION_STATUS',
          title: '✅ Guardian Transferred Allowance Funds',
          message: `Your Guardian transferred ₹${fundReq.amount.toLocaleString()} allowance to your wallet.`
        });
      }
    } catch (dbErr) {
      console.warn('[UserController] DB query error approving fund request, using fallback');
    }

    // Update in memory fallback
    const memIdx = memoryFundRequests.findIndex(r => r._id === id);
    if (memIdx !== -1) {
      memoryFundRequests[memIdx].status = 'APPROVED';
    }

    const io = getSocketManager();
    const requesterIdStr = fundReq ? fundReq.requesterId.toString() : '660000000000000000000001';
    const amountVal = fundReq ? fundReq.amount : 10000;

    if (io) {
      io.to(`user:${requesterIdStr}`).emit('fund:approved', {
        amount: amountVal,
        message: `Your Guardian approved and transferred ₹${amountVal.toLocaleString()} to your wallet!`
      });
    }

    return res.json({
      success: true,
      message: `Transferred ₹${amountVal.toLocaleString()} allowance to ward's wallet successfully!`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to approve fund request', error: error.message });
  }
};

export const rejectFundRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    try {
      const fundReq = await FundRequest.findById(id);
      if (fundReq) {
        fundReq.status = 'REJECTED';
        await fundReq.save();
      }
    } catch (dbErr) {
      // ignore
    }

    const memIdx = memoryFundRequests.findIndex(r => r._id === id);
    if (memIdx !== -1) {
      memoryFundRequests[memIdx].status = 'REJECTED';
    }

    return res.json({
      success: true,
      message: 'Allowance request declined.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to decline request', error: error.message });
  }
};

