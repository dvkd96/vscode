'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Button, Card, LoadingSkeleton } from '@/components/ui';
import { useSubsyncStore } from '@/store/useSubsyncStore';

type Summary = {
  users: number;
  waitlist: number;
  requests: number;
  offers: number;
};

type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  college: string | null;
  role: string;
  verified: boolean;
  created_at: string;
};

type WaitlistEntry = {
  id: string;
  email: string;
  source: string;
  created_at: string;
};

type RequestEntry = {
  id: string;
  name: string;
  email: string;
  college: string | null;
  subscription_name: string;
  budget_per_month: string | null;
  details: string | null;
  created_at: string;
};

type OfferEntry = {
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

type DemandEntry = {
  subscription_name: string;
  total: number;
};

export default function AdminPage() {
  const addToast = useSubsyncStore((state) => state.addToast);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [summary, setSummary] = React.useState<Summary>({ users: 0, waitlist: 0, requests: 0, offers: 0 });
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [waitlist, setWaitlist] = React.useState<WaitlistEntry[]>([]);
  const [requests, setRequests] = React.useState<RequestEntry[]>([]);
  const [offers, setOffers] = React.useState<OfferEntry[]>([]);
  const [topDemand, setTopDemand] = React.useState<DemandEntry[]>([]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/results');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load owner data.');
      }

      setSummary(data.data.summary || { users: 0, waitlist: 0, requests: 0, offers: 0 });
      setUsers(data.data.users || []);
      setWaitlist(data.data.waitlist || []);
      setRequests(data.data.requests || []);
      setOffers(data.data.offers || []);
      setTopDemand(data.data.topDemand || []);
    } catch (err: any) {
      const message = err.message || 'Could not fetch owner data.';
      setError(message);
      addToast({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (value: string) => new Date(value).toLocaleString();

  const combinedNeeds = [
    ...requests.map((item) => ({
      type: 'Request',
      name: item.name,
      email: item.email,
      college: item.college,
      subscription: item.subscription_name,
      need: item.budget_per_month ? `Budget Rs ${item.budget_per_month}` : 'Budget N/A',
      details: item.details || 'No extra details',
      createdAt: item.created_at,
    })),
    ...offers.map((item) => ({
      type: 'Offer',
      name: item.name,
      email: item.email,
      college: item.college,
      subscription: item.subscription_name,
      need: `${item.available_slots}/${item.total_slots} slots • ${item.price_per_user ? `Rs ${item.price_per_user}` : 'Price N/A'}`,
      details: item.details || 'No extra details',
      createdAt: item.created_at,
    })),
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-custom pt-24 pb-12 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Founder dashboard</p>
            <h1 className="section-title mt-2">Owner data console</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
              View website registrations, waitlist signups, and all user needs in one place without any login step.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={fetchData}>Refresh</Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <LoadingSkeleton className="h-24" />
            <LoadingSkeleton className="h-72" />
            <LoadingSkeleton className="h-72" />
          </div>
        ) : error ? (
          <Card className="glass-card p-6">
            <h2 className="text-xl font-semibold">Could not load owner data</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">{error}</p>
            <p className="text-sm text-slate-500 mt-3">Refresh the page or check the backend connection.</p>
          </Card>
        ) : (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Users', value: summary.users },
                { label: 'Waitlist', value: summary.waitlist },
                { label: 'Requests', value: summary.requests },
                { label: 'Offers', value: summary.offers },
              ].map((item) => (
                <Card key={item.label} className="glass-card p-5">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="text-3xl font-bold mt-2">{item.value}</p>
                </Card>
              ))}
            </div>

            <Card className="glass-card p-5">
              <h2 className="text-xl font-bold mb-3">Top demand</h2>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                {topDemand.length === 0 ? (
                  <p className="text-slate-500 text-sm">No demand data yet.</p>
                ) : (
                  topDemand.map((item) => (
                    <div key={item.subscription_name} className="rounded-xl border border-white/30 bg-white/60 dark:bg-slate-900/50 p-3">
                      <p className="font-medium">{item.subscription_name}</p>
                      <p className="text-sm text-slate-500">{item.total} total entries</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="glass-card p-5">
              <h2 className="text-xl font-bold mb-3">Registered users</h2>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200/70 dark:border-slate-700/70">
                      <th className="py-3 pr-4 font-medium">Name</th>
                      <th className="py-3 pr-4 font-medium">Email</th>
                      <th className="py-3 pr-4 font-medium">College</th>
                      <th className="py-3 pr-4 font-medium">Role</th>
                      <th className="py-3 pr-4 font-medium">Verified</th>
                      <th className="py-3 pr-4 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td className="py-4 text-slate-500" colSpan={6}>No users yet.</td>
                      </tr>
                    ) : (
                      users.map((item) => (
                        <tr key={item.id} className="border-b border-white/20 last:border-b-0">
                          <td className="py-3 pr-4 font-medium">{item.name || 'Unnamed user'}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{item.email}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{item.college || 'No college'}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{item.role}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{item.verified ? 'Yes' : 'No'}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{formatDate(item.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="glass-card p-5">
              <h2 className="text-xl font-bold mb-3">Needs and offers</h2>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200/70 dark:border-slate-700/70">
                      <th className="py-3 pr-4 font-medium">Type</th>
                      <th className="py-3 pr-4 font-medium">Name</th>
                      <th className="py-3 pr-4 font-medium">Email</th>
                      <th className="py-3 pr-4 font-medium">College</th>
                      <th className="py-3 pr-4 font-medium">Subscription</th>
                      <th className="py-3 pr-4 font-medium">Need / Offer</th>
                      <th className="py-3 pr-4 font-medium">Details</th>
                      <th className="py-3 pr-4 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinedNeeds.length === 0 ? (
                      <tr>
                        <td className="py-4 text-slate-500" colSpan={8}>No requests or offers yet.</td>
                      </tr>
                    ) : (
                      combinedNeeds.map((item) => (
                        <tr key={`${item.type}-${item.email}-${item.createdAt}`} className="border-b border-white/20 last:border-b-0 align-top">
                          <td className="py-3 pr-4 font-medium">{item.type}</td>
                          <td className="py-3 pr-4">{item.name}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{item.email}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{item.college || 'No college'}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{item.subscription}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{item.need}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300 max-w-md">{item.details}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{formatDate(item.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="glass-card p-5">
              <h2 className="text-xl font-bold mb-3">Waitlist</h2>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200/70 dark:border-slate-700/70">
                      <th className="py-3 pr-4 font-medium">Email</th>
                      <th className="py-3 pr-4 font-medium">Source</th>
                      <th className="py-3 pr-4 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waitlist.length === 0 ? (
                      <tr>
                        <td className="py-4 text-slate-500" colSpan={3}>No waitlist entries yet.</td>
                      </tr>
                    ) : (
                      waitlist.map((item) => (
                        <tr key={item.id} className="border-b border-white/20 last:border-b-0">
                          <td className="py-3 pr-4 font-medium">{item.email}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{item.source}</td>
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{formatDate(item.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
