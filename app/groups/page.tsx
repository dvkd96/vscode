'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Button, Card } from '@/components/ui';
import { useSubsyncStore } from '@/store/useSubsyncStore';

export default function GroupsPage() {
  const { groups, joinManagedGroup, addToast } = useSubsyncStore();

  const onJoinManaged = (id: string) => {
    const result = joinManagedGroup(id);
    addToast({ type: result.ok ? 'success' : 'error', message: result.message });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-custom pt-24 pb-12">
        <h1 className="section-title mb-2">Managed subscription flow</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Join a managed group and unlock access automatically when it reaches full capacity.</p>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const percentage = Math.round((group.joined / group.total) * 100);
            const unlocked = group.joined >= group.total;

            return (
              <motion.div key={group.id} whileHover={{ y: -6 }}>
                <Card className="glass-card h-full">
                  <h2 className="text-xl font-bold">{group.name}</h2>
                  <p className="text-sm mt-1 text-slate-500">{group.joined}/{group.total} users joined</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                    />
                  </div>

                  <p className="mt-3 text-sm">Progress: {percentage}%</p>
                  <p className="text-sm">Price: Rs {group.price}/month</p>

                  <p className={`mt-4 text-sm font-semibold ${unlocked ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {unlocked ? 'Access unlocked for all members' : 'Waiting for group to fill'}
                  </p>

                  <Button className="mt-4" onClick={() => onJoinManaged(group.id)}>
                    Join managed group
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
