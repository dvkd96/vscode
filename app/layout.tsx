import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import React from 'react';
import { ClientShell } from '@/components/client-shell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'Subsync - Student Subscription Sharing Platform',
  description: 'Share subscriptions, save money - the smart way for students',
  keywords: 'subscription, sharing, students, Netflix, Spotify, ChatGPT',
  icons: {
    icon: '/subsync-logo.png',
    shortcut: '/subsync-logo.png',
    apple: '/subsync-logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <ClientShell>
          <main>{children}</main>
        </ClientShell>
      </body>
    </html>
  );
}
