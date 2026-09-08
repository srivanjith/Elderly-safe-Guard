import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './config/db';
import { initSocketManager } from './sockets/socketManager';
import { apiLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import guardianRoutes from './routes/guardianRoutes';
import transactionRoutes from './routes/transactionRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';
import { seedDatabase } from './scripts/seed';
import User from './models/User';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// Socket.IO Setup
initSocketManager(server);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/guardians', guardianRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SafePay Guardian Backend',
    database: isDbConnected() ? 'connected' : 'offline (in-memory demo mode)',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Auto-seed if database is connected and empty
  if (isDbConnected()) {
    try {
      const userCount = await User.countDocuments().maxTimeMS(3000);
      if (userCount === 0) {
        console.log('[Server] Database is empty. Seeding initial demo data...');
        await seedDatabase();
      }
    } catch (err) {
      console.warn('[Server] Seed check warning:', err);
    }
  }

  server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(` 🛡️ SAFEPAY GUARDIAN BACKEND ONLINE ON PORT ${PORT}`);
    console.log(` REST API:   http://localhost:${PORT}/api`);
    console.log(` WebSockets: ws://localhost:${PORT}`);
    console.log(`==================================================\n`);
  });
};

startServer();
