import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../lib/authContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { NotificationToast } from '../components/NotificationToast';

export const metadata: Metadata = {
  title: 'SafePay Guardian - AI Digital Payment Protection Platform',
  description: 'Protecting elderly and vulnerable users before suspicious high-risk money transfers leave their account.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <NotificationToast />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
