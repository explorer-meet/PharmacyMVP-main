import { Baby, CheckCircle2, ExternalLink, HeartPulse, ShoppingBag, ShieldPlus, Sparkles } from 'lucide-react';
import CheckoutFooter from '../components/CheckoutFooter';

const careSections = [
  {
    title: 'Postpartum Recovery',
    icon: HeartPulse,
    accent: 'border-pink-100 bg-pink-50/70 text-pink-700',
    items: ['Hydration, rest, and pain management basics', 'Bleeding and wound-care red flags', 'Mental wellbeing and postnatal follow-up reminders'],
    link: 'https://www.youtube.com/results?search_query=postpartum+recovery+tips',
  },
  {
    title: 'Newborn Care Basics',
    icon: Baby,
    accent: 'border-cyan-100 bg-cyan-50/70 text-cyan-700',
    items: ['Feeding cues, burping, and sleep hygiene basics', 'Diaper, skin, and umbilical cord care', 'Fever, breathing, or poor feeding warning signs'],
    link: 'https://www.youtube.com/results?search_query=newborn+baby+care+basics',
  },
  {
    title: 'Daily Essentials',
    icon: ShoppingBag,
    accent: 'border-amber-100 bg-amber-50/70 text-amber-700',
    items: ['Mother wellness needs and recovery supplies', 'Baby hygiene and feeding support products', 'Simple refill and prescription help when needed'],
    link: 'https://www.youtube.com/results?search_query=baby+mother+care+essentials',
  },
];

export default function BabyMotherCareGuide() {
  return (
    <div
      className="min-h-screen px-4 pb-14 sm:px-6 lg:px-8"
      style={{
        paddingTop: 'calc(var(--app-navbar-offset, 88px) + 2.5rem)',
        background: 'linear-gradient(180deg, #fffdf7 0%, #fff7fb 32%, #f8fafc 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl">
        <header className="relative overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-700 via-rose-600 to-amber-500 p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-amber-200/20 blur-2xl" />

          <div className="relative z-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-pink-100">Mother and Newborn Support</p>
              <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Baby & Mother Care</h1>
              <p className="mt-3 max-w-2xl text-sm text-rose-50 sm:text-base">
                A focused guide for postpartum recovery, newborn care basics, and essential daily support for mothers and babies.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/20 px-4 py-3 text-sm font-semibold backdrop-blur">
                <Baby className="h-4 w-4" />
                Newborn Basics
              </div>
              <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Recovery Support
              </div>
            </div>
          </div>
        </header>

        <main className="mt-8 space-y-8">
          <section className="grid gap-4 md:grid-cols-3">
            {careSections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`mb-4 inline-flex rounded-2xl border p-3 ${section.accent}`}>
                  <section.icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                <ul className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={section.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <ExternalLink className="h-4 w-4" />
                  Watch Care Videos
                </a>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-6 shadow-sm">
              <h2 className="text-2xl font-extrabold text-slate-900">First Weeks Checklist</h2>
              <ul className="mt-5 space-y-3">
                {[
                  'Keep postnatal follow-up dates visible and documented',
                  'Monitor feeding, urine output, and baby sleep patterns',
                  'Prepare hygiene and breastfeeding essentials in one place',
                  'Ask for clinical help early if mother or baby symptoms worsen',
                ].map((step, index) => (
                  <li key={step} className="flex items-start gap-3 rounded-2xl border border-pink-100 bg-white px-4 py-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
                <ShieldPlus className="h-6 w-6 text-amber-600" />
                Seek Medical Care Quickly If You Notice
              </h2>
              <div className="mt-5 space-y-3">
                {[
                  'Heavy bleeding, severe pain, fainting, or high fever in the mother',
                  'Baby breathing difficulty, poor feeding, fever, or unusual sleepiness',
                  'Signs of wound infection, breast infection, or dehydration',
                  'Persistent sadness, panic, or mental health distress after delivery',
                ].map((warning) => (
                  <div key={warning} className="rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3 text-sm text-slate-700">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <div className="mt-10">
        <CheckoutFooter />
      </div>
    </div>
  );
}