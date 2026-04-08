'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Button, Card } from '@/components/ui';
import { getAuthToken } from '@/lib/client-auth';
import { useSubsyncStore } from '@/store/useSubsyncStore';
import { ALL_SUBSCRIPTIONS, TOP_SUBSCRIPTIONS } from '@/lib/subscription-catalog';

function OfferSubscriptionContent() {
  const searchParams = useSearchParams();
  const addToast = useSubsyncStore((state) => state.addToast);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    college: '',
    subscriptionName: '',
    totalSlots: '',
    availableSlots: '',
    pricePerUser: '',
    details: '',
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  React.useEffect(() => {
    const preset = searchParams.get('subscription');
    if (preset) {
      setFormData((prev) => ({ ...prev, subscriptionName: preset }));
    }
  }, [searchParams]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch('/api/prototype/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          totalSlots: Number(formData.totalSlots),
          availableSlots: Number(formData.availableSlots),
          pricePerUser: formData.pricePerUser ? Number(formData.pricePerUser) : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit offer.');
      }

      addToast({ type: 'success', message: 'Offer saved. It appears on Submissions page.' });
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        college: '',
        subscriptionName: '',
        totalSlots: '',
        availableSlots: '',
        pricePerUser: '',
        details: '',
      });
      setTimeout(() => setShowSuccess(false), 1600);
    } catch (error: any) {
      addToast({ type: 'error', message: error.message || 'Could not submit offer.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-custom pt-24 pb-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card p-8 relative overflow-hidden">
            <div className="absolute -top-16 -right-12 w-40 h-40 rounded-full bg-violet-500/25 blur-3xl" />
            <h1 className="section-title">Have a subscription to share?</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Fill this to offer your subscription slots. Your details are securely stored for review.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input className="input-base" name="name" value={formData.name} onChange={onChange} placeholder="Your name" required />
                <input className="input-base" name="email" value={formData.email} onChange={onChange} placeholder="Email" required />
              </div>

              <input className="input-base" name="college" value={formData.college} onChange={onChange} placeholder="College name" />

              <div className="rounded-xl border border-white/35 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Top picks</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TOP_SUBSCRIPTIONS.slice(0, 8).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, subscriptionName: item }))}
                      className="px-3 py-2 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-sm font-medium hover:scale-[1.02] transition-transform"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <Link href="/explore" className="inline-block mt-3 text-sm text-blue-700 dark:text-blue-300 font-semibold">
                  Explore all options →
                </Link>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="input-base"
                  list="offer-subscription-options"
                  name="subscriptionName"
                  value={formData.subscriptionName}
                  onChange={onChange}
                  placeholder="Subscription you have"
                  required
                />
                <input
                  className="input-base"
                  type="number"
                  min="0"
                  name="pricePerUser"
                  value={formData.pricePerUser}
                  onChange={onChange}
                  placeholder="Price per user (INR)"
                />
              </div>

              <datalist id="offer-subscription-options">
                {ALL_SUBSCRIPTIONS.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="input-base"
                  type="number"
                  min="1"
                  name="totalSlots"
                  value={formData.totalSlots}
                  onChange={onChange}
                  placeholder="Total slots"
                  required
                />
                <input
                  className="input-base"
                  type="number"
                  min="0"
                  name="availableSlots"
                  value={formData.availableSlots}
                  onChange={onChange}
                  placeholder="Available slots"
                  required
                />
              </div>

              <textarea
                className="input-base min-h-[120px]"
                name="details"
                value={formData.details}
                onChange={onChange}
                placeholder="Extra details (duration, plan type, rules, etc.)"
              />

              <Button type="submit" isLoading={isLoading}>
                Submit Offer
              </Button>
            </form>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 px-4 py-3"
                >
                  Submitted successfully.
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function OfferSubscriptionPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen" />}>
      <OfferSubscriptionContent />
    </React.Suspense>
  );
}
