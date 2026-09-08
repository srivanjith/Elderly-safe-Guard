import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware';
import Transaction from '../models/Transaction';
import User from '../models/User';
import GuardianRelationship from '../models/GuardianRelationship';
import Notification from '../models/Notification';
import { FraudEngineService } from '../services/fraudEngine';
import { HoldService } from '../services/holdService';
import { getSocketManager } from '../sockets/socketManager';
import { AuditService } from '../services/auditService';

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { recipientName, recipientId, amount, note, deviceChanged = false } = req.body;

    if (!recipientName || !recipientId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipient Name, Recipient Handle (ID), and Amount > 0 are required'
      });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ success: false, message: 'Sender account not found' });
    }

    if (sender.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient simulated wallet balance (Current: ₹${sender.walletBalance.toLocaleString()})`
      });
    }

    // Run Fraud Engine Assessment
    const riskResult = await FraudEngineService.analyzeTransaction({
      senderId: senderId!,
      amount,
      recipientId,
      deviceChanged
    });

    // Find primary guardian assigned to this elderly user
    const primaryRel = await GuardianRelationship.findOne({ userId: senderId, isPrimary: true })
      .populate('guardianId', 'name email');
    const backupRel = primaryRel ? null : await GuardianRelationship.findOne({ userId: senderId })
      .populate('guardianId', 'name email');
    
    const assignedGuardianId = primaryRel?.guardianId?._id || backupRel?.guardianId?._id;

    let transactionStatus: any = 'PROCESSING';
    if (riskResult.riskLevel === 'HIGH') {
      transactionStatus = 'PENDING_GUARDIAN_APPROVAL';
    } else {
      transactionStatus = 'COMPLETED';
    }

    const transaction = await Transaction.create({
      senderId,
      recipientName,
      recipientId,
      amount,
      note: note || '',
      status: transactionStatus,
      riskScore: riskResult.riskScore,
      riskLevel: riskResult.riskLevel,
      riskReasons: riskResult.reasons,
      guardianId: assignedGuardianId,
      expiresAt: riskResult.riskLevel === 'HIGH' ? new Date(Date.now() + 10 * 60 * 1000) : undefined
    });

    const io = getSocketManager();

    if (riskResult.riskLevel === 'HIGH') {
      // Hold transaction in Redis/Memory
      if (assignedGuardianId) {
        await HoldService.holdTransaction(
          transaction._id.toString(),
          senderId!,
          assignedGuardianId.toString(),
          amount,
          recipientName,
          riskResult.riskScore,
          riskResult.reasons
        );

        // Send Notification to Guardian
        const notif = await Notification.create({
          userId: assignedGuardianId,
          type: 'GUARDIAN_APPROVAL_REQUEST',
          title: '⚠️ High Risk Transaction Flagged',
          message: `${sender.name} attempted a transfer of ₹${amount.toLocaleString()} to ${recipientName}. Risk Score: ${riskResult.riskScore}/100. Approval required.`,
          transactionId: transaction._id
        });

        if (io) {
          io.to(`guardian:${assignedGuardianId.toString()}`).emit('transaction:high-risk', {
            transactionId: transaction._id,
            userName: sender.name,
            amount,
            recipientName,
            riskScore: riskResult.riskScore,
            riskReasons: riskResult.reasons,
            createdAt: transaction.createdAt,
            notification: notif
          });
        }
      }
    } else {
      // Deduct balance for completed transaction
      sender.walletBalance -= amount;
      await sender.save();
    }

    await AuditService.log('CREATE_TRANSACTION', 'Transaction', senderId, transaction._id.toString(), {
      amount,
      riskScore: riskResult.riskScore,
      status: transactionStatus
    });

    return res.status(201).json({
      success: true,
      message: riskResult.riskLevel === 'HIGH' 
        ? 'High-risk payment intercepted! Placed on temporary hold pending guardian review.'
        : 'Payment processed successfully.',
      transaction
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Transaction failed', error: error.message });
  }
};

export const getPendingApprovals = async (req: AuthRequest, res: Response) => {
  try {
    const guardianId = req.user?.id;

    // Refresh expired holds first
    await HoldService.checkExpiredHolds();

    const pendingList = await Transaction.find({
      guardianId,
      status: 'PENDING_GUARDIAN_APPROVAL'
    })
      .populate('senderId', 'name email walletBalance phone')
      .sort({ createdAt: -1 });

    return res.json({ success: true, pending: pendingList });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve pending approvals', error: error.message });
  }
};

export const approveTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const guardianId = req.user?.id;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.status !== 'PENDING_GUARDIAN_APPROVAL') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve transaction in status: ${transaction.status}`
      });
    }

    const sender = await User.findById(transaction.senderId);
    if (!sender) {
      return res.status(404).json({ success: false, message: 'Sender not found' });
    }

    if (sender.walletBalance < transaction.amount) {
      return res.status(400).json({ success: false, message: 'Sender has insufficient wallet balance' });
    }

    // Deduct balance
    sender.walletBalance -= transaction.amount;
    await sender.save();

    transaction.status = 'COMPLETED';
    transaction.guardianDecision = 'APPROVE';
    transaction.guardianDecisionTime = new Date();
    await transaction.save();

    await HoldService.releaseHold(id);

    // Create Notification for Elderly User
    await Notification.create({
      userId: transaction.senderId,
      type: 'TRANSACTION_STATUS',
      title: '✅ Payment Approved by Guardian',
      message: `Your payment of ₹${transaction.amount.toLocaleString()} to ${transaction.recipientName} was approved by your guardian.`,
      transactionId: transaction._id
    });

    const io = getSocketManager();
    if (io) {
      io.to(`user:${transaction.senderId.toString()}`).emit('transaction:approved', {
        transactionId: transaction._id,
        amount: transaction.amount,
        recipientName: transaction.recipientName,
        status: 'COMPLETED'
      });
    }

    await AuditService.log('GUARDIAN_APPROVE', 'Transaction', guardianId, id, { amount: transaction.amount });

    return res.json({
      success: true,
      message: 'Payment approved and completed successfully.',
      transaction
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to approve transaction', error: error.message });
  }
};

export const blockTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const guardianId = req.user?.id;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.status !== 'PENDING_GUARDIAN_APPROVAL') {
      return res.status(400).json({
        success: false,
        message: `Cannot block transaction in status: ${transaction.status}`
      });
    }

    transaction.status = 'CANCELLED';
    transaction.guardianDecision = 'BLOCK';
    transaction.guardianDecisionTime = new Date();
    await transaction.save();

    await HoldService.releaseHold(id);

    // Create Notification for Elderly User
    await Notification.create({
      userId: transaction.senderId,
      type: 'TRANSACTION_STATUS',
      title: '🛑 Payment Blocked by Guardian',
      message: `Your payment of ₹${transaction.amount.toLocaleString()} to ${transaction.recipientName} was blocked to prevent potential financial scam.`,
      transactionId: transaction._id
    });

    const io = getSocketManager();
    if (io) {
      io.to(`user:${transaction.senderId.toString()}`).emit('transaction:blocked', {
        transactionId: transaction._id,
        amount: transaction.amount,
        recipientName: transaction.recipientName,
        status: 'CANCELLED'
      });
    }

    await AuditService.log('GUARDIAN_BLOCK', 'Transaction', guardianId, id, { amount: transaction.amount });

    return res.json({
      success: true,
      message: 'Suspicious payment blocked successfully. Funds retained in wallet.',
      transaction
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to block transaction', error: error.message });
  }
};

export const getUserTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const { status, riskLevel } = req.query;

    let filter: any = {};
    if (role === 'ELDERLY_USER') {
      filter.senderId = userId;
    } else if (role === 'GUARDIAN') {
      filter.guardianId = userId;
    }

    if (status) filter.status = status;
    if (riskLevel) filter.riskLevel = riskLevel;

    const transactions = await Transaction.find(filter)
      .populate('senderId', 'name email')
      .populate('guardianId', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ success: true, transactions });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve transactions', error: error.message });
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
      .populate('senderId', 'name email phone walletBalance')
      .populate('guardianId', 'name email phone');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    return res.json({ success: true, transaction });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch transaction', error: error.message });
  }
};

export const analyzeRiskOnly = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { amount, recipientId, deviceChanged } = req.body;

    const result = await FraudEngineService.analyzeTransaction({
      senderId: senderId!,
      amount: Number(amount) || 0,
      recipientId: recipientId || 'unknown@safepay',
      deviceChanged: !!deviceChanged
    });

    return res.json({ success: true, assessment: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Risk assessment failed', error: error.message });
  }
};
