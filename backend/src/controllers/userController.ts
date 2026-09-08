import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import { AuditService } from '../services/auditService';

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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};
