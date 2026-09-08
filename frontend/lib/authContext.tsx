'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from './api';
import { getSocket } from './socket';

export type Role = 'ELDERLY_USER' | 'GUARDIAN' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  walletBalance: number;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  demoLogin: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('safepay_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        // Connect Socket room
        const socket = getSocket();
        socket.emit('join:room', { userId: res.data.user.id, role: res.data.user.role });
      } else {
        localStorage.removeItem('safepay_token');
        setUser(null);
      }
    } catch (err) {
      console.warn('[AuthContext] Failed to verify user token');
      localStorage.removeItem('safepay_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = (token: string, userData: UserProfile) => {
    localStorage.setItem('safepay_token', token);
    setUser(userData);
    const socket = getSocket();
    socket.emit('join:room', { userId: userData.id, role: userData.role });

    // Redirect based on role
    if (userData.role === 'GUARDIAN') {
      router.push('/guardian-dashboard');
    } else if (userData.role === 'ADMIN') {
      router.push('/admin-dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const demoLogin = async (email: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password: 'Demo123!' });
      if (res.data.success && res.data.token) {
        login(res.data.token, res.data.user);
      }
    } catch (err: any) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        alert('⚠️ Demo Login Failed: Backend server on http://localhost:5000 is offline. Please start the backend service using "npm run dev" in the root directory.');
      } else {
        alert(`Demo login failed: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('safepay_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser: fetchCurrentUser,
        demoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
