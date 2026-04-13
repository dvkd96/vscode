'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { clearAuthToken, isAuthenticated } from '@/lib/client-auth';
import { useSubsyncStore } from '@/store/useSubsyncStore';

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const toggleDarkMode = useSubsyncStore((s) => s.toggleDarkMode);
  const darkMode = useSubsyncStore((s) => s.darkMode);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setSignedIn(isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    clearAuthToken();
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/request-subscription', label: 'Need Subscription' },
    { href: '/offer-subscription', label: 'Offer Subscription' },
    { href: '/submissions', label: 'Submissions' },
    { href: '/groups', label: 'Live Groups' },
    { href: '/payments', label: 'Payments' },
    { href: '/create-listing', label: 'Create Listing' },
  ];

  const isLanding = pathname === '/';
  const showSolid = isScrolled || !isLanding;

  const menuLinks = (user || signedIn)
    ? navLinks
    : [
        { href: '/', label: 'Home' },
        { href: '/explore', label: 'Explore' },
        { href: '/login', label: 'Login' },
        { href: '/signup', label: 'Sign Up' },
      ];

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <motion.nav
        className={clsx(
          'fixed w-full top-0 z-50 transition-all duration-300',
          showSolid
            ? 'bg-white/75 dark:bg-slate-950/75 backdrop-blur-xl border-b border-white/40 dark:border-white/10 shadow-xl'
            : 'bg-transparent'
        )}
        initial={{ y: 0 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl"
            >
              <img src="/subsync-logo.png?v=subsync-20260408-4" alt="Subsync Logo" width={40} height={40} />
              <span className="text-slate-900 dark:text-slate-100">SubSync</span>
            </Link>
          </motion.div>

            {/* Right Menu Button */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex items-center justify-center"
                aria-label="Toggle dark mode"
              >
                <span className="text-lg">{darkMode ? '☀' : '☾'}</span>
              </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {isOpen && (
        <div className="fixed inset-0 z-[70]" onClick={closeMenu}>
          <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]" />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute right-0 top-0 h-full w-[86vw] max-w-sm bg-white/90 dark:bg-slate-950/90 border-l border-white/40 dark:border-white/10 backdrop-blur-2xl p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Menu</p>
              <button
                onClick={closeMenu}
                className="w-9 h-9 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {(user || signedIn) && (
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 font-semibold"
              >
                Logout
              </button>
            )}
          </motion.aside>
        </div>
      )}
    </>
  );
}
