import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import Transaction from '../models/Transaction';
import AuditLog from '../models/AuditLog';

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalElderlyUsers = await User.countDocuments({ role: 'ELDERLY_USER' });
    const totalGuardians = await User.countDocuments({ role: 'GUARDIAN' });

    const transactions = await Transaction.find();
    const totalTransactions = transactions.length;
    const completedTransactions = transactions.filter(t => t.status === 'COMPLETED').length;
    const pendingTransactions = transactions.filter(t => t.status === 'PENDING_GUARDIAN_APPROVAL').length;
    const highRiskCount = transactions.filter(t => t.riskLevel === 'HIGH').length;
    const mediumRiskCount = transactions.filter(t => t.riskLevel === 'MEDIUM').length;
    const lowRiskCount = transactions.filter(t => t.riskLevel === 'LOW').length;

    const blockedTransactions = transactions.filter(t => t.status === 'CANCELLED' && t.guardianDecision === 'BLOCK');
    const blockedCount = blockedTransactions.length;
    const totalFraudPreventedAmount = blockedTransactions.reduce((sum, t) => sum + t.amount, 0);

    const approvedCount = transactions.filter(t => t.guardianDecision === 'APPROVE').length;

    // Chart dataset: Risk Level breakdown
    const riskDistribution = [
      { name: 'Low Risk', value: lowRiskCount, color: '#10B981' },
      { name: 'Medium Risk', value: mediumRiskCount, color: '#F59E0B' },
      { name: 'High Risk', value: highRiskCount, color: '#EF4444' }
    ];

    // Chart dataset: Guardian Action ratio
    const guardianResolutionRatio = [
      { name: 'Approved Payments', count: approvedCount },
      { name: 'Blocked Fraud Attempts', count: blockedCount }
    ];

    // Recent activity timeline
    const recentActivity = await AuditLog.find()
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(10);

    return res.json({
      success: true,
      metrics: {
        totalUsers,
        totalElderlyUsers,
        totalGuardians,
        totalTransactions,
        completedTransactions,
        pendingTransactions,
        highRiskCount,
        blockedCount,
        totalFraudPreventedAmount
      },
      charts: {
        riskDistribution,
        guardianResolutionRatio
      },
      recentActivity
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to generate admin analytics', error: error.message });
  }
};

export const getAllTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await Transaction.find()
      .populate('senderId', 'name email role')
      .populate('guardianId', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ success: true, transactions });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve transactions', error: error.message });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve users', error: error.message });
  }
};
