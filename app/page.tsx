'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Button, Card } from '@/components/ui';
import { isAuthenticated } from '@/lib/client-auth';
import { useSubsyncStore } from '@/store/useSubsyncStore';
import { TOP_SUBSCRIPTIONS } from '@/lib/subscription-catalog';

const testimonials = [
  {
    name: 'Priya, IIT Delhi',
    quote: 'I just needed one place to ask for a subscription instead of messaging people everywhere.',
  },
  {
    name: 'Arjun, DU',
    quote: 'It is simple to check what people want and join without too much back and forth.',
  },
  {
    name: 'Nikita, BITS',
    quote: 'I can see which subscriptions are popular and what slots are left. That makes it easy to decide.',
  },
];

const faqs = [
  {
    q: 'How do students show demand on SubSync?',
    a: 'Students submit one request with budget and details. The demand appears instantly so others can match without scattered chats.',
    icon: '↻',
  },
  {
    q: 'Can I join or leave a shared group quickly?',
    a: 'Yes. Slot availability and group status are visible in real time, so joins, exits, and replacements are easier to coordinate.',
    icon: '✓',
  },
  {
    q: 'Is student data private and trackable?',
    a: 'All submissions are collected in one protected inbox route with authentication and can be exported to CSV for auditing.',
    icon: '☍',
  },
  {
    q: 'Can I set my own subscription budget?',
    a: 'Absolutely. Requests include your preferred budget and details, so teammates can quickly see if they fit before joining.',
    icon: '◈',
  },
];

export default function Home() {
  const router = useRouter();
  const { marketplace, groups, addToast } = useSubsyncStore();
  const [email, setEmail] = React.useState('');
  const [waitlistSuccess, setWaitlistSuccess] = React.useState(false);
  const [activeTestimonial, setActiveTestimonial] = React.useState(0);
  const [showDemoFlow, setShowDemoFlow] = React.useState(false);
  const [selectedFaq, setSelectedFaq] = React.useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -90]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.96]);
  const orbY = useTransform(scrollYProgress, [0, 0.35], [0, -130]);

  React.useEffect(() => {
    const id = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated()) {
      router.push('/dashboard');
      return;
    }
    router.push('/login');
  };

  const handleWaitlist = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes('@')) {
      addToast({ type: 'error', message: 'Enter a valid email to join waitlist.' });
      return;
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not join waitlist.');
      }

      setWaitlistSuccess(true);
      addToast({ type: 'success', message: 'Welcome! You are now on the waitlist.' });
      setEmail('');
      setTimeout(() => setWaitlistSuccess(false), 1800);
    } catch (error: any) {
      addToast({ type: 'error', message: error.message || 'Could not join waitlist.' });
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 overflow-x-hidden">
      <Navbar />

      <section className="relative min-h-screen pt-28 pb-20 px-4 flex items-center">
        <motion.div style={{ y: orbY }} className="absolute -top-24 left-[-8%] w-[38rem] h-[38rem] bg-blue-500/30 blur-[120px] rounded-full" />
        <motion.div style={{ y: orbY }} className="absolute top-10 right-[-12%] w-[42rem] h-[42rem] bg-cyan-400/20 blur-[120px] rounded-full" />

        <motion.div className="container-custom relative z-10" style={{ y: heroY, scale: heroScale }}>
          <motion.div
            initial={{ opacity: 0, y: 48, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center"
          >
            <div>
              <p className="inline-flex items-center rounded-full border border-white/40 bg-white/60 dark:bg-slate-900/60 px-3 py-1 text-xs md:text-sm font-semibold text-blue-700 mb-6">
                Campus subscription network
              </p>
              <h1 className="font-[var(--font-poppins)] text-[2.3rem] md:text-[5rem] leading-[1.02] font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-50">
                Find your subscription squad,
                <br />
                <span className="text-blue-600">split costs without chaos.</span>
              </h1>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button size="lg" onClick={handleGetStarted}>Join Now</Button>
                <Button size="lg" variant="secondary" onClick={() => setShowDemoFlow(true)}>What Students Need</Button>
                <a href="#waitlist">
                  <Button size="lg" variant="ghost">Get Priority Access</Button>
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 max-w-xl gap-4 text-sm md:text-base">
                <div>
                  <p className="text-2xl font-bold">5,000+</p>
                  <p className="text-slate-500">active students</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">43%</p>
                  <p className="text-slate-500">avg monthly savings</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">2 min</p>
                  <p className="text-slate-500">group join flow</p>
                </div>
              </div>
            </div>

            <div className="relative h-[26rem] md:h-[30rem]">
              <motion.div
                initial={{ opacity: 0, x: 26, rotate: 5 }}
                animate={{ opacity: 1, x: 0, rotate: 2 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="absolute right-0 top-4 w-[88%] h-64 rounded-3xl border border-white/35 bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-700 shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 22, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="absolute left-2 bottom-10 w-[70%] rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-white/40 dark:border-white/10 p-4 shadow-xl"
              >
                <p className="text-xs uppercase tracking-wide text-blue-700">Demand heatmap</p>
                <p className="text-xl font-semibold mt-2">See what your campus wants now.</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Top requests update quickly so you can launch the right shared plans first.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24, rotate: 8 }}
                animate={{ opacity: 1, y: 0, rotate: 4 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="absolute right-0 bottom-2 w-[62%] rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-white/40 dark:border-white/10 p-4 shadow-xl"
              >
                <p className="text-xs uppercase tracking-wide text-cyan-700">Instant clarity</p>
                <p className="text-lg font-semibold mt-2">Live slots, real prices, clear status.</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Students know exactly where seats are open and what to pay.</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-custom grid gap-10 lg:grid-cols-2 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }}>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Built for campus groups</p>
            <h2 className="font-[var(--font-poppins)] text-4xl md:text-6xl leading-[1.02] tracking-[-0.03em] mt-3">
              Real student demand.
              <br />
              <span className="text-blue-700">Simple group formation.</span>
            </h2>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-xl">
              Collect intent, match with available slots, and move to confirmed groups faster with clear pricing and fewer messages.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 px-3 py-1">Live groups</span>
              <span className="rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900 px-3 py-1">Smart urgency</span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1">Clean submissions</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} className="relative h-[25rem]">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-200/80 via-cyan-100/80 to-white/90 dark:from-slate-800 dark:to-slate-900 border border-white/40 dark:border-white/10 p-5">
              <div className="rounded-2xl border border-white/50 dark:border-white/10 bg-white/55 dark:bg-slate-900/45 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">Live campus dashboard</p>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-white/85 dark:bg-slate-950/70 p-3">
                    <p className="text-lg font-semibold">142</p>
                    <p className="text-xs text-slate-500">requests</p>
                  </div>
                  <div className="rounded-xl bg-white/85 dark:bg-slate-950/70 p-3">
                    <p className="text-lg font-semibold">69</p>
                    <p className="text-xs text-slate-500">offers</p>
                  </div>
                  <div className="rounded-xl bg-white/85 dark:bg-slate-950/70 p-3">
                    <p className="text-lg font-semibold">31</p>
                    <p className="text-xs text-slate-500">active groups</p>
                  </div>
                </div>
              </div>
            </div>
            <motion.div
              whileHover={{ y: -4 }}
              className="absolute top-6 left-6 right-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-white/40 dark:border-white/10 p-5 shadow-lg"
            >
              <p className="text-xs uppercase tracking-wide text-blue-700">Priority Access</p>
              <p className="text-2xl font-semibold mt-1">Get early access to SubSync</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Join pilot onboarding, unlock launch perks, and shape the product roadmap.</p>
            </motion.div>
            <motion.div
              initial={{ rotate: -4 }}
              whileHover={{ rotate: -1, y: -4 }}
              className="absolute bottom-6 left-3 w-[58%] rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 shadow-xl"
            >
              <p className="font-semibold">Faster matching</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">High-demand plans fill quicker with visible interest.</p>
            </motion.div>
            <motion.div
              initial={{ rotate: 5 }}
              whileHover={{ rotate: 1, y: -4 }}
              className="absolute bottom-10 right-4 w-[48%] rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 shadow-xl"
            >
              <p className="font-semibold">Instant visibility</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Know who joined and what is left.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-24 px-4"
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">How it flows</p>
            <h2 className="font-[var(--font-poppins)] text-4xl md:text-6xl leading-[1.05] tracking-[-0.03em] mt-3 max-w-4xl">
              Start with intent, move with momentum, close with confidence.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} className="glass-card p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">01 Request</p>
              <h3 className="text-2xl font-semibold mt-2">Need a plan?</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Post once, and your demand becomes visible to every potential teammate.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} viewport={{ once: false }} className="glass-card p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">02 Match</p>
              <h3 className="text-2xl font-semibold mt-2">Have extra slots?</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Offer details, fill seats quickly, and track group progress in real time.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} viewport={{ once: false }} className="glass-card p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">03 Close</p>
              <h3 className="text-2xl font-semibold mt-2">Show outcomes</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Every submission is centralized and export-ready for reviews or demos.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-22 px-4 bg-gradient-to-b from-white/25 to-blue-50/75 dark:from-slate-950/20 dark:to-slate-950/60"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.22 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-custom grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
            <h2 className="font-[var(--font-poppins)] text-3xl md:text-5xl tracking-[-0.02em]">Live marketplace signal</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">A single scrolling feed shows urgency and price clarity without noisy micro-sections.</p>
            <div className="mt-7 space-y-3">
              {marketplace.slice(0, 4).map((item) => (
                <motion.div key={item.id} whileHover={{ y: -2 }} className="glass-card px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">{item.category}</p>
                    <p className="text-lg font-semibold">{item.name}</p>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Rs {item.price}/month</div>
                  <div className="text-sm font-medium text-rose-600">Only {item.slotsLeft} slots left</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} className="glass-card p-6 md:p-8">
            <p className="text-sm text-slate-500 mb-3">Group fill status</p>
            <div className="space-y-4">
              {groups.slice(0, 4).map((group) => {
                const pct = Math.round((group.joined / group.total) * 100);
                return (
                  <div key={group.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{group.name}</span>
                      <span>{group.joined}/{group.total}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: false }}
                        transition={{ duration: 1.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-14 px-4"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-custom">
          <div className="glass-card p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Most requested</p>
                <h3 className="text-2xl md:text-3xl font-[var(--font-poppins)] mt-1">Top picks students usually ask for</h3>
              </div>
              <Button variant="secondary" onClick={() => router.push('/explore')}>Explore Full List</Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {TOP_SUBSCRIPTIONS.slice(0, 8).map((item) => (
                <span key={item} className="px-3 py-2 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="relative py-24 px-4 bg-sky-400/85 dark:bg-sky-700/80 overflow-hidden"
        initial={{ opacity: 0, y: 90 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute -top-24 right-[-6%] w-72 h-72 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute bottom-[-6rem] left-[-4rem] w-80 h-80 rounded-full bg-cyan-200/30 blur-2xl" />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
            <h2 className="font-[var(--font-poppins)] text-3xl md:text-5xl text-slate-900 mb-3">Subscription sharing, questions answered.</h2>
            <p className="text-slate-800/80 text-lg max-w-3xl">Everything students ask before joining: trust, speed, pricing clarity, and group coordination.</p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {faqs.map((item, idx) => {
              const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];
              return (
                <motion.button
                  key={item.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  viewport={{ once: false }}
                  whileHover={{ y: -8, rotate: 0 }}
                  onClick={() => setSelectedFaq(idx)}
                  className={`glass-card ${rotations[idx % rotations.length]} text-left p-6 md:p-7 min-h-56 bg-white/90 dark:bg-slate-950/80`}
                >
                  <div className="text-3xl text-sky-500 mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold leading-tight">{item.q}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-3 text-sm">Tap to open quick answer</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="waitlist"
        className="py-24 px-4"
        initial={{ opacity: 0, y: 80, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.28 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-custom max-w-5xl">
          <Card className="glass-card p-8 md:p-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-[2rem]">
            <h2 className="font-[var(--font-poppins)] text-3xl md:text-5xl tracking-[-0.02em]">Get early access before your campus</h2>
            <p className="mt-3 text-blue-100 text-lg">Join the waitlist to access pilot features, priority onboarding, and launch updates.</p>

            <form onSubmit={handleWaitlist} className="mt-7 flex flex-col sm:flex-row gap-3">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@college.edu"
                className="flex-1 rounded-xl px-4 py-3 text-slate-900 outline-none"
              />
              <Button type="submit" size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
                Join Waitlist
              </Button>
            </form>

            <AnimatePresence>
              {waitlistSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mt-4 font-semibold"
                >
                  Saved. You are on the list.
                </motion.p>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </motion.section>

      <motion.section
        className="pb-24 px-4"
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-custom max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="glass-card text-center p-8 md:p-10">
                <p className="text-2xl md:text-3xl leading-snug font-[var(--font-poppins)]">“{testimonials[activeTestimonial].quote}”</p>
                <p className="mt-4 text-blue-700 dark:text-blue-300 font-semibold">{testimonials[activeTestimonial].name}</p>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      <motion.section
        className="py-24 px-4 bg-slate-950 text-slate-100"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="text-center mb-14">
            <p className="text-slate-400 tracking-[0.2em] uppercase text-sm">Get in touch</p>
            <h2 className="font-[var(--font-poppins)] text-4xl md:text-6xl tracking-[-0.03em] mt-3">Talk to the team</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8"
            >
              <p className="text-4xl mb-4">✉</p>
              <h3 className="text-2xl font-semibold">Email</h3>
              <p className="mt-2 text-slate-300">Quick replies. Real people. Ask anything about waitlist, flow, or demo access.</p>
              <a href="mailto:subsync@gmail.com" className="inline-block mt-4 text-sky-300 font-semibold hover:text-sky-200 transition-colors">
                subsync@gmail.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8"
            >
              <p className="text-4xl mb-4">⌖</p>
              <h3 className="text-2xl font-semibold">Visit us</h3>
              <p className="mt-2 text-slate-300">Swing by for a quick walkthrough and product showcase.</p>
              <p className="mt-4 text-sky-300 font-semibold">IIT Bombay, Mumbai</p>
            </motion.div>
          </div>

          <div className="mt-12 text-center text-slate-400 text-sm border-t border-white/10 pt-6">
            © 2026 SubSync. All rights reserved.
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {selectedFaq !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] bg-slate-950/55 backdrop-blur-sm grid place-items-center px-4"
            onClick={() => setSelectedFaq(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="w-full max-w-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Card className="glass-card p-7 md:p-8">
                <p className="text-sm uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Quick answer</p>
                <h3 className="text-2xl md:text-3xl font-[var(--font-poppins)] mt-3">{faqs[selectedFaq].q}</h3>
                <p className="mt-4 text-slate-700 dark:text-slate-200 leading-relaxed">{faqs[selectedFaq].a}</p>
                <div className="mt-6">
                  <Button variant="secondary" onClick={() => setSelectedFaq(null)}>Close</Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {showDemoFlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-slate-950/50 backdrop-blur-sm grid place-items-center px-4"
            onClick={() => setShowDemoFlow(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="w-full max-w-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Card className="glass-card p-7 md:p-8">
                <h3 className="text-2xl md:text-3xl font-[var(--font-poppins)] font-semibold">What students look for</h3>
                <div className="mt-5 space-y-3 text-slate-700 dark:text-slate-200">
                  <p>1. A quick way to say what subscription they need.</p>
                  <p>2. Clear pricing and how many people are already interested.</p>
                  <p>3. Simple steps to join or share a subscription.</p>
                  <p>4. A trusted place to leave email, college, and budget details.</p>
                  <p>5. A clean inbox where submissions can be reviewed later.</p>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button onClick={() => { setShowDemoFlow(false); router.push('/request-subscription'); }}>Open Request Form</Button>
                  <Button variant="secondary" onClick={() => setShowDemoFlow(false)}>Close</Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
