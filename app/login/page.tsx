'use client';

import React from 'react';
import { Navbar } from '@/components/navbar';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container-custom flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
