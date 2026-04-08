'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Card, Button } from '@/components/ui';
import { ALL_SUBSCRIPTIONS, TOP_SUBSCRIPTIONS } from '@/lib/subscription-catalog';

const SUBSCRIPTION_PRICE_HINT: Record<string, string> = {
  'ChatGPT': 'Approx Rs 399/month',
  'Netflix': 'Approx Rs 149/month',
  'Spotify': 'Approx Rs 59/month',
  'Canva': 'Approx Rs 99/month',
  'Amazon Prime Video': 'Approx Rs 125/month',
  'Disney+ Hotstar': 'Approx Rs 149/month',
  'YouTube Premium': 'Approx Rs 129/month',
  'Sony LIV': 'Approx Rs 299/month',
  'ZEE5': 'Approx Rs 129/month',
  'Apple Music': 'Approx Rs 99/month',
  'Amazon Prime (full membership)': 'Approx Rs 125/month',
  'Microsoft 365': 'Approx Rs 489/month',
  'Google One': 'Approx Rs 130/month',
  'Notion': 'Approx Rs 320/month',
  'Grammarly': 'Approx Rs 999/month',
  'Adobe Creative Cloud': 'Approx Rs 1,675/month',
  'Figma (Professional)': 'Approx Rs 1,200/month',
  'CapCut Pro': 'Approx Rs 599/month',
  'Coursera Plus': 'Approx Rs 4,900/month',
  'Udemy Business': 'Approx Rs 1,700/month',
  'GitHub Copilot': 'Approx Rs 830/month',
  'JetBrains All Products Pack': 'Approx Rs 2,490/month',
  'Dropbox': 'Approx Rs 980/month',
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-custom pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Explore</p>
          <h1 className="section-title mt-2">All Subscription Options</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Top picks are highlighted first, and the full list is available below for broader student demand collection.
          </p>
        </motion.div>

        <Card className="glass-card p-6 mt-8">
          <p className="text-sm uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">Top picks</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {TOP_SUBSCRIPTIONS.map((name) => (
              <span key={name} className="px-3 py-2 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-sm font-medium">
                {name}
              </span>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-6 mt-6">
          <p className="text-sm uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">Full catalog</p>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALL_SUBSCRIPTIONS.map((name, idx) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(idx * 0.02, 0.22) }}
                className="rounded-xl border border-white/35 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 px-4 py-3"
              >
                <p className="font-medium">{name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {SUBSCRIPTION_PRICE_HINT[name] || 'Price varies by plan'}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/request-subscription?subscription=${encodeURIComponent(name)}`}>
                    <Button size="sm">Request</Button>
                  </Link>
                  <Link href={`/offer-subscription?subscription=${encodeURIComponent(name)}`}>
                    <Button size="sm" variant="secondary">Offer</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
