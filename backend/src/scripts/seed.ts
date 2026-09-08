import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';
import User from '../models/User';
import GuardianRelationship from '../models/GuardianRelationship';
import Transaction from '../models/Transaction';
import Notification from '../models/Notification';
import AuditLog from '../models/AuditLog';

dotenv.config();

export const seedDatabase = async () => {
  try {
    try {
      dns.setDefaultResultOrder('ipv4first');
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (e) {
      // ignore
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/safepay_guardian';
    await mongoose.connect(mongoUri);
    console.log('[Seed Script] Connected to MongoDB Atlas successfully.');

    // Clear existing data
    await User.deleteMany({});
    await GuardianRelationship.deleteMany({});
    await Transaction.deleteMany({});
    await Notification.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('[Seed Script] Database cleared.');

    const defaultPassword = await bcrypt.hash('Demo123!', 10);

    // Create Demo Users
    const elderlyUser = await User.create({
      name: 'Ramakrishna Sharma',
      email: 'elderly@safepay.demo',
      password: defaultPassword,
      role: 'ELDERLY_USER',
      walletBalance: 150000,
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
    });

    const guardianUser = await User.create({
      name: 'Arun Sharma (Son)',
      email: 'guardian@safepay.demo',
      password: defaultPassword,
      role: 'GUARDIAN',
      walletBalance: 0,
      phone: '+91 98765 88888',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    const adminUser = await User.create({
      name: 'SafePay Security Admin',
      email: 'admin@safepay.demo',
      password: defaultPassword,
      role: 'ADMIN',
      walletBalance: 0,
      phone: '+91 98000 00000'
    });

    console.log('[Seed Script] Demo users created successfully.');

    // Establish Guardian Relationship
    const relationship = await GuardianRelationship.create({
      userId: elderlyUser._id,
      guardianId: guardianUser._id,
      relationship: 'Son',
      isPrimary: true
    });

    console.log('[Seed Script] Guardian relationship established.');

    // Seed Sample Transactions
    const tx1 = await Transaction.create({
      senderId: elderlyUser._id,
      recipientName: 'Daily Fresh Organics',
      recipientId: 'store@organics.upimock',
      amount: 850,
      note: 'Weekly Grocery Purchase',
      status: 'COMPLETED',
      riskScore: 12,
      riskLevel: 'LOW',
      riskReasons: ['Standard local vendor transaction'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });

    const tx2 = await Transaction.create({
      senderId: elderlyUser._id,
      recipientName: 'Apollo Pharmacy & Wellness',
      recipientId: 'apollopharmacy@safepay',
      amount: 4200,
      note: 'Monthly Prescription Medicines',
      status: 'COMPLETED',
      riskScore: 24,
      riskLevel: 'LOW',
      riskReasons: ['Recognized healthcare provider'],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    const tx3 = await Transaction.create({
      senderId: elderlyUser._id,
      recipientName: 'Ravi Kumar',
      recipientId: 'ravi@safepay',
      amount: 50000,
      note: 'Urgent Investment Plan Transfer',
      status: 'PENDING_GUARDIAN_APPROVAL',
      riskScore: 85,
      riskLevel: 'HIGH',
      riskReasons: [
        'Transaction amount is significantly higher than normal (₹50,000)',
        'Recipient is brand new with no previous transfer history',
        'High-value transfer pattern anomaly detected'
      ],
      guardianId: guardianUser._id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      createdAt: new Date()
    });

    const tx4 = await Transaction.create({
      senderId: elderlyUser._id,
      recipientName: 'International Telecom Scam Outlet',
      recipientId: 'lottery_claim@fastpay',
      amount: 85000,
      note: 'Customs Duty Fee for Prize',
      status: 'CANCELLED',
      riskScore: 95,
      riskLevel: 'HIGH',
      riskReasons: [
        'Unusually high amount for new recipient',
        'Recipient handle reported for lottery scam indicators',
        'AI anomaly engine score flag'
      ],
      guardianId: guardianUser._id,
      guardianDecision: 'BLOCK',
      guardianDecisionTime: new Date(Date.now() - 5 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 60 * 1000)
    });

    const tx5 = await Transaction.create({
      senderId: elderlyUser._id,
      recipientName: 'City Heart Hospital',
      recipientId: 'cityhospital@safepay',
      amount: 35000,
      note: 'Emergency Medical Deposit',
      status: 'COMPLETED',
      riskScore: 68,
      riskLevel: 'HIGH',
      riskReasons: ['High amount transfer requiring verification'],
      guardianId: guardianUser._id,
      guardianDecision: 'APPROVE',
      guardianDecisionTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 13 * 60 * 60 * 1000)
    });

    // Seed Notifications
    await Notification.create({
      userId: guardianUser._id,
      type: 'GUARDIAN_APPROVAL_REQUEST',
      title: '⚠️ Suspicious Transaction Alert',
      message: `${elderlyUser.name} attempted a payment of ₹50,000 to Ravi Kumar. Risk Score: 85/100. Approval required.`,
      transactionId: tx3._id,
      isRead: false
    });

    await Notification.create({
      userId: elderlyUser._id,
      type: 'TRANSACTION_STATUS',
      title: '🛑 Payment Blocked by Guardian',
      message: `Your transfer of ₹85,000 to International Telecom Scam Outlet was intercepted and blocked by Arun Sharma (Son).`,
      transactionId: tx4._id,
      isRead: true
    });

    // Audit logs
    await AuditLog.create({
      userId: elderlyUser._id,
      action: 'TRANSACTION_INTERCEPTED',
      entity: 'Transaction',
      entityId: tx3._id.toString(),
      metadata: { riskScore: 85, recipient: 'Ravi Kumar' }
    });

    await AuditLog.create({
      userId: guardianUser._id,
      action: 'GUARDIAN_BLOCK',
      entity: 'Transaction',
      entityId: tx4._id.toString(),
      metadata: { amount: 85000, recipient: 'International Telecom Scam Outlet' }
    });

    console.log('\n======================================================');
    console.log('  🛡️ SAFEPAY GUARDIAN DEMO ACCOUNTS SEEDED TO ATLAS');
    console.log('======================================================');
    console.log(' 👴 ELDERLY USER:  elderly@safepay.demo   / Demo123!');
    console.log(' 🛡️ GUARDIAN:      guardian@safepay.demo  / Demo123!');
    console.log(' 👑 ADMIN:         admin@safepay.demo     / Demo123!');
    console.log('======================================================\n');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed Script] Error seeding data:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase();
}
