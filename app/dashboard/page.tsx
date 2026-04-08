'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Button, Card, LoadingSkeleton } from '@/components/ui';
import { useSubsyncStore } from '@/store/useSubsyncStore';

const sections = ['My subscriptions', 'Joined groups', 'Payments', 'Notifications'] as const;
type Section = typeof sections[number];

export default function DashboardPage() {
  const { marketplace, groups } = useSubsyncStore();
  const [activeSection, setActiveSection] = React.useState<Section>('My subscriptions');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const notifications = [
    'Netflix group payment reminder due tomorrow',
    'Canva Creators Pod has 1 slot remaining',
    'Your ChatGPT group access was refreshed',
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-custom pt-24 pb-10 grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="glass-card p-4 h-fit sticky top-24">
          <h2 className="font-bold text-lg mb-4">Dashboard</h2>
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                  activeSection === section
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </aside>

        <main>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <LoadingSkeleton className="h-40" />
              <LoadingSkeleton className="h-40" />
              <LoadingSkeleton className="h-64 md:col-span-2" />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="glass-card p-6">
                <h1 className="text-3xl font-bold">{activeSection}</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">See your subscriptions, groups, payments, and updates in one place.</p>
              </Card>

              {activeSection === 'My subscriptions' && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {marketplace.slice(0, 3).map((item) => (
                    <motion.div key={item.id} whileHover={{ y: -6 }}>
                      <Card className="glass-card">
                        <p className="text-sm text-primary-600 font-semibold">{item.category}</p>
                        <h3 className="text-xl font-bold mt-1">{item.name}</h3>
                        <p className="text-slate-600 dark:text-slate-300 mt-2">Rs {item.price}/month</p>
                        <p className="mt-3 text-sm text-rose-600">Only {item.slotsLeft} slots left</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeSection === 'Joined groups' && (
                <div className="grid gap-4 md:grid-cols-2">
                  {groups.map((group) => {
                    const percentage = (group.joined / group.total) * 100;
                    return (
                      <Card key={group.id} className="glass-card">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <p className="text-sm mt-1 text-slate-500">{group.joined}/{group.total} members</p>
                        <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                          />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {activeSection === 'Payments' && (
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="glass-card"><p className="text-slate-500">This month</p><p className="text-2xl font-bold mt-2">Rs 617</p></Card>
                  <Card className="glass-card"><p className="text-slate-500">Total saved</p><p className="text-2xl font-bold mt-2">Rs 3,940</p></Card>
                  <Card className="glass-card"><p className="text-slate-500">Upcoming</p><p className="text-2xl font-bold mt-2">Rs 149</p></Card>
                </div>
              )}

              {activeSection === 'Notifications' && (
                <div className="space-y-3">
                  {notifications.map((item) => (
                    <Card key={item} className="glass-card p-4">
                      <p>{item}</p>
                    </Card>
                  ))}
                </div>
              )}

              <Card className="glass-card flex flex-wrap gap-3">
                <Button onClick={() => setActiveSection('My subscriptions')}>Refresh activity</Button>
                <Button variant="secondary" onClick={() => setActiveSection('Notifications')}>View alerts</Button>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
