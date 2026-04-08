'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Button, Card } from '@/components/ui';
import { useSubsyncStore } from '@/store/useSubsyncStore';

export default function MarketplacePage() {
  const { marketplace, joinGroup, addToast } = useSubsyncStore();
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'peer' | 'managed'>('all');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [paying, setPaying] = React.useState(false);

  const filtered = marketplace.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' ? true : item.model === filter;
    return matchesQuery && matchesFilter;
  });

  const selected = marketplace.find((item) => item.id === selectedId) ?? null;

  const handleJoin = async () => {
    if (!selected) return;
    setPaying(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const result = joinGroup(selected.id);
    setPaying(false);
    setSelectedId(null);
    addToast({ type: result.ok ? 'success' : 'error', message: result.message });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-custom pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="section-title">Find a Group to Join</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Browse available groups, compare price and slots, then join in a few taps.</p>
        </motion.div>

        <Card className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search subscriptions"
            className="input-base bg-white/70 dark:bg-slate-900/70"
          />
          <div className="flex gap-2">
            {(['all', 'peer', 'managed'] as const).map((item) => (
              <Button key={item} variant={filter === item ? 'primary' : 'secondary'} onClick={() => setFilter(item)}>
                {item}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <motion.div key={item.id} whileHover={{ y: -6, scale: 1.01 }}>
              <Card className="glass-card h-full">
                <p className="text-xs uppercase font-semibold text-primary-600">{item.category} • {item.model}</p>
                <h3 className="text-xl font-bold mt-2">{item.name}</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-2">{item.description}</p>
                <p className="mt-4 font-semibold">Rs {item.price}/month</p>
                <p className="mt-2 text-sm text-rose-600">Only {item.slotsLeft} slots left</p>
                <Button className="mt-4" onClick={() => setSelectedId(item.id)}>Join group</Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-slate-950/50 backdrop-blur-sm grid place-items-center px-4"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="w-full max-w-lg"
              onClick={(event) => event.stopPropagation()}
            >
              <Card className="glass-card p-6">
                <h3 className="text-2xl font-bold">Join {selected.name}</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-2">{selected.description}</p>
                <div className="mt-4 space-y-1 text-sm">
                  <p>Price: Rs {selected.price}/month</p>
                  <p>Slots left: {selected.slotsLeft}</p>
                  <p>Next: Payment → Confirmed seat → Group updates</p>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button onClick={handleJoin} isLoading={paying}>Pay & Join</Button>
                  <Button variant="secondary" onClick={() => setSelectedId(null)}>Cancel</Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
