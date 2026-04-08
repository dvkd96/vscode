'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Button, Card } from '@/components/ui';
import { useSubsyncStore } from '@/store/useSubsyncStore';

export default function CreateListingPage() {
  const router = useRouter();
  const { createListing, addToast } = useSubsyncStore();

  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState<'AI' | 'OTT' | 'Music' | 'Productivity'>('AI');
  const [price, setPrice] = React.useState('');
  const [slots, setSlots] = React.useState('4');
  const [description, setDescription] = React.useState('');

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const slotCount = Number(slots);
    const parsedPrice = Number(price);

    if (!name || !description || slotCount <= 0 || parsedPrice <= 0) {
      addToast({ type: 'error', message: 'Fill all listing fields correctly.' });
      return;
    }

    createListing({
      name,
      category,
      price: parsedPrice,
      slotsLeft: slotCount,
      totalSlots: slotCount,
      model: 'peer',
      description,
    });

    addToast({ type: 'success', message: 'Listing published successfully.' });
    router.push('/marketplace');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-custom pt-24 pb-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card p-8">
            <h1 className="section-title">Create a subscription listing</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2 mb-6">Add subscription details, slots, and price to publish your offer.</p>

            <form onSubmit={onSubmit} className="space-y-4">
              <input value={name} onChange={(event) => setName(event.target.value)} className="input-base" placeholder="Subscription name" />

              <div className="grid sm:grid-cols-2 gap-3">
                <select value={category} onChange={(event) => setCategory(event.target.value as 'AI' | 'OTT' | 'Music' | 'Productivity')} className="input-base">
                  <option value="AI">AI</option>
                  <option value="OTT">OTT</option>
                  <option value="Music">Music</option>
                  <option value="Productivity">Productivity</option>
                </select>
                <input value={price} onChange={(event) => setPrice(event.target.value)} className="input-base" type="number" min="1" placeholder="Price per month" />
              </div>

              <input value={slots} onChange={(event) => setSlots(event.target.value)} className="input-base" type="number" min="1" placeholder="Total slots" />
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="input-base min-h-[120px]" placeholder="Short description" />

              <div className="flex gap-3">
                <Button type="submit">Publish listing</Button>
                <Button type="button" variant="secondary" onClick={() => router.push('/marketplace')}>Back to marketplace</Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
