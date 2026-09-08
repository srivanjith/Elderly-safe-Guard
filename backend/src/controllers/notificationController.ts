import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Notification from '../models/Notification';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (id === 'all') {
      await Notification.updateMany({ userId, isRead: false }, { isRead: true });
      return res.json({ success: true, message: 'All notifications marked as read' });
    }

    const notif = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.json({ success: true, notification: notif });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update notification', error: error.message });
  }
};
