import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import { AuditService } from '../services/auditService';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ELDERLY_USER', 'GUARDIAN', 'ADMIN']).default('ELDERLY_USER'),
  phone: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const register = async (req: Request, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: validated.email.toLowerCase() });

    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);
    const user = await User.create({
      name: validated.name,
      email: validated.email.toLowerCase(),
      password: hashedPassword,
      role: validated.role,
      phone: validated.phone || '',
      walletBalance: validated.role === 'ELDERLY_USER' ? 150000 : 0
    });

    const jwtSecret = process.env.JWT_SECRET || 'safepay_super_secret_jwt_key_2026_demo';
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      jwtSecret,
      { expiresIn: '7d' }
    );

    await AuditService.log('USER_REGISTER', 'User', user._id.toString(), user._id.toString(), { role: user.role });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
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
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

const FALLBACK_DEMO_USERS: Record<string, { id: string; name: string; email: string; role: 'ELDERLY_USER' | 'GUARDIAN' | 'ADMIN'; walletBalance: number; phone?: string }> = {
  'elderly@safepay.demo': {
    id: '660000000000000000000001',
    name: 'Ramakrishna Sharma',
    email: 'elderly@safepay.demo',
    role: 'ELDERLY_USER',
    walletBalance: 150000,
    phone: '+91 98765 43210'
  },
  'guardian@safepay.demo': {
    id: '660000000000000000000002',
    name: 'Arun Sharma (Son)',
    email: 'guardian@safepay.demo',
    role: 'GUARDIAN',
    walletBalance: 0,
    phone: '+91 98765 88888'
  },
  'admin@safepay.demo': {
    id: '660000000000000000000003',
    name: 'SafePay Security Admin',
    email: 'admin@safepay.demo',
    role: 'ADMIN',
    walletBalance: 0,
    phone: '+91 98000 00000'
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase();

    let user: any = null;
    let isMatch = false;

    try {
      user = await User.findOne({ email: normalizedEmail }).maxTimeMS(3000);
      if (user) {
        isMatch = await bcrypt.compare(password, user.password);
      }
    } catch (dbErr) {
      console.warn('[AuthController] DB query failed/timed out during login, checking demo fallback...');
    }

    // Fallback logic for demo accounts if DB lookup fails or user not found in DB
    if (!user && FALLBACK_DEMO_USERS[normalizedEmail]) {
      if (password === 'Demo123!') {
        const demoUser = FALLBACK_DEMO_USERS[normalizedEmail];
        const jwtSecret = process.env.JWT_SECRET || 'safepay_super_secret_jwt_key_2026_demo';
        const token = jwt.sign(
          { id: demoUser.id, email: demoUser.email, role: demoUser.role, name: demoUser.name },
          jwtSecret,
          { expiresIn: '7d' }
        );

        return res.json({
          success: true,
          message: 'Login successful (Demo Mode)',
          token,
          user: demoUser
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'safepay_super_secret_jwt_key_2026_demo';
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      jwtSecret,
      { expiresIn: '7d' }
    );

    try {
      await AuditService.log('USER_LOGIN', 'User', user._id.toString(), user._id.toString());
    } catch (auditErr) {
      // Ignore audit log error if DB is down
    }

    return res.json({
      success: true,
      message: 'Login successful',
      token,
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
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // Check if token user is a fallback demo user
    const fallbackUser = Object.values(FALLBACK_DEMO_USERS).find((u) => u.id === req.user?.id || u.email === req.user?.email);

    try {
      const user = await User.findById(req.user.id).select('-password').maxTimeMS(3000);
      if (user) {
        return res.json({
          success: true,
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
      console.warn('[AuthController] DB query failed during /auth/me, using fallback payload...');
    }

    if (fallbackUser) {
      return res.json({
        success: true,
        user: fallbackUser
      });
    }

    if (req.user) {
      return res.json({
        success: true,
        user: {
          id: req.user.id,
          name: req.user.name || 'User',
          email: req.user.email,
          role: req.user.role,
          walletBalance: req.user.role === 'ELDERLY_USER' ? 150000 : 0
        }
      });
    }

    return res.status(404).json({ success: false, message: 'User not found' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user details', error: error.message });
  }
};
