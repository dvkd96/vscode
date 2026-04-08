'use client';

import React from 'react';
import { Navbar } from '@/components/navbar';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container-custom flex justify-center">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
