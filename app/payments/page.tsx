'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Card } from '@/components/ui';

const payments = [
  { id: 'p-101', service: 'ChatGPT Pro', amount: 399, status: 'Paid', date: '2026-04-02' },
  { id: 'p-102', service: 'Spotify Family', amount: 59, status: 'Paid', date: '2026-04-01' },
  { id: 'p-103', service: 'Netflix Premium', amount: 149, status: 'Due', date: '2026-04-11' },
];

export default function PaymentsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-custom pt-24 pb-12">
        <h1 className="section-title mb-2">Payments</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Track monthly payments and upcoming due dates.</p>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="glass-card"><p className="text-slate-500">Spent this month</p><p className="text-2xl font-bold mt-2">Rs 607</p></Card>
          <Card className="glass-card"><p className="text-slate-500">Saved this month</p><p className="text-2xl font-bold mt-2">Rs 512</p></Card>
          <Card className="glass-card"><p className="text-slate-500">Active plans</p><p className="text-2xl font-bold mt-2">4</p></Card>
        </div>

        <div className="space-y-3">
          {payments.map((payment) => (
            <motion.div key={payment.id} whileHover={{ y: -2 }}>
              <Card className="glass-card flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{payment.service}</p>
                  <p className="text-sm text-slate-500">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs {payment.amount}</p>
                  <p className={`text-sm ${payment.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{payment.status}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
