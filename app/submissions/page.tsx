'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Button, Card, LoadingSkeleton } from '@/components/ui';
import { getAuthToken } from '@/lib/client-auth';
import { useSubsyncStore } from '@/store/useSubsyncStore';

type RequestItem = {
  id: string;
  name: string;
  email: string;
  college: string | null;
  subscription_name: string;
  budget_per_month: string | null;
  details: string | null;
  created_at: string;
};

type OfferItem = {
  id: string;
  name: string;
  email: string;
  college: string | null;
  subscription_name: string;
  total_slots: number;
  available_slots: number;
  price_per_user: string | null;
  details: string | null;
  created_at: string;
};

export default function SubmissionsPage() {
  const addToast = useSubsyncStore((state) => state.addToast);
  const [isLoading, setIsLoading] = React.useState(true);
  const [requests, setRequests] = React.useState<RequestItem[]>([]);
  const [offers, setOffers] = React.useState<OfferItem[]>([]);

  const csvEscape = (value: unknown) => {
    const stringValue = value === null || value === undefined ? '' : String(value);
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const exportCSV = () => {
    const headers = [
      'type',
      'id',
      'name',
      'email',
      'college',
      'subscription_name',
      'budget_per_month',
      'total_slots',
      'available_slots',
      'price_per_user',
      'details',
      'created_at',
    ];

    const requestRows = requests.map((item) => [
      'request',
      item.id,
      item.name,
      item.email,
      item.college || '',
      item.subscription_name,
      item.budget_per_month || '',
      '',
      '',
      '',
      item.details || '',
      item.created_at,
    ]);

    const offerRows = offers.map((item) => [
      'offer',
      item.id,
      item.name,
      item.email,
      item.college || '',
      item.subscription_name,
      '',
      item.total_slots,
      item.available_slots,
      item.price_per_user || '',
      item.details || '',
      item.created_at,
    ]);

    const rows = [headers, ...requestRows, ...offerRows];
    const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subsync-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', message: 'CSV downloaded successfully.' });
  };

  const fetchSubmissions = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch('/api/prototype/submissions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load submissions.');
      }
      setRequests(data.data.requests || []);
      setOffers(data.data.offers || []);
    } catch (error: any) {
      addToast({ type: 'error', message: error.message || 'Could not fetch submissions.' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  React.useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-custom pt-24 pb-12">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="section-title">Submissions inbox</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              This page collects both student requests and offers in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={exportCSV}>
              Export CSV
            </Button>
            <Button onClick={fetchSubmissions} isLoading={isLoading}>Refresh</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <LoadingSkeleton className="h-40" />
            <LoadingSkeleton className="h-40" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-card">
              <h2 className="text-xl font-bold mb-3">Need Subscription ({requests.length})</h2>
              <div className="space-y-3 max-h-[65vh] overflow-auto pr-1">
                {requests.length === 0 && <p className="text-slate-500 text-sm">No requests yet.</p>}
                {requests.map((item) => (
                  <motion.div key={item.id} whileHover={{ y: -2 }} className="rounded-lg border border-white/30 bg-white/60 dark:bg-slate-900/50 p-3">
                    <p className="font-semibold">{item.subscription_name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{item.name} • {item.email}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.college || 'No college'} • Budget: {item.budget_per_month ? `Rs ${item.budget_per_month}` : 'N/A'}
                    </p>
                    {item.details && <p className="text-sm mt-2 text-slate-700 dark:text-slate-200">{item.details}</p>}
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="glass-card">
              <h2 className="text-xl font-bold mb-3">Offer Subscription ({offers.length})</h2>
              <div className="space-y-3 max-h-[65vh] overflow-auto pr-1">
                {offers.length === 0 && <p className="text-slate-500 text-sm">No offers yet.</p>}
                {offers.map((item) => (
                  <motion.div key={item.id} whileHover={{ y: -2 }} className="rounded-lg border border-white/30 bg-white/60 dark:bg-slate-900/50 p-3">
                    <p className="font-semibold">{item.subscription_name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{item.name} • {item.email}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.college || 'No college'} • Slots: {item.available_slots}/{item.total_slots} • Price: {item.price_per_user ? `Rs ${item.price_per_user}` : 'N/A'}
                    </p>
                    {item.details && <p className="text-sm mt-2 text-slate-700 dark:text-slate-200">{item.details}</p>}
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
