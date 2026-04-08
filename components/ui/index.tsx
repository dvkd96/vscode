'use client';

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

  const onButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (!disabled && !isLoading) {
      const rect = event.currentTarget.getBoundingClientRect();
      setRipples((prev) => [
        ...prev,
        { x: event.clientX - rect.left, y: event.clientY - rect.top, id: Date.now() + Math.random() },
      ]);
    }

    props.onClick?.(event);
  };

  React.useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 450);
    return () => clearTimeout(timer);
  }, [ripples]);

  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 disabled:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 disabled:text-slate-300',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className, 'relative overflow-hidden')}
      disabled={disabled || isLoading}
      onClick={onButtonClick}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute w-28 h-28 rounded-full bg-white/35 pointer-events-none"
          style={{
            left: ripple.x - 56,
            top: ripple.y - 56,
            transform: 'scale(0)',
            animation: 'ripple 0.45s linear',
          }}
        />
      ))}
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx('bg-white rounded-xl shadow-sm border border-slate-200 p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={clsx('bg-slate-200 rounded-lg animate-pulse', className)} />
  );
}

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  };

  const iconColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx('border rounded-lg p-4 flex items-center gap-3', bgColor[type])}
    >
      <span className={clsx('text-xl', iconColor[type])}>
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
      </span>
      <span className={clsx('flex-1', textColor[type])}>{message}</span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={onClose}
        className={clsx('text-lg font-bold', textColor[type])}
      >
        ✕
      </motion.button>
    </motion.div>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

export function Badge({ variant = 'primary', size = 'md', className, children }: BadgeProps) {
  const bgColor = {
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={clsx('rounded-full font-medium', bgColor[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
}
