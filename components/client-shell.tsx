'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSubsyncStore } from '@/store/useSubsyncStore';

export function ClientShell({ children }: { children: React.ReactNode }) {
  const darkMode = useSubsyncStore((s) => s.darkMode);
  const toasts = useSubsyncStore((s) => s.toasts);
  const removeToast = useSubsyncStore((s) => s.removeToast);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        removeToast(toast.id);
      }, 2800)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [removeToast, toasts]);

  return (
    <>
      {children}
      <div className="fixed z-[120] bottom-6 right-6 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              className="pointer-events-auto rounded-xl border border-white/30 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl px-4 py-3 shadow-xl"
            >
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
