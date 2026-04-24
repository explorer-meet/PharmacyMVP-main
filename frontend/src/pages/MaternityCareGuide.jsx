import { Calendar, CheckCircle2, ExternalLink, HeartPulse, ShieldAlert, Sparkles } from 'lucide-react';
import CheckoutFooter from '../components/CheckoutFooter';

const monthWiseGuides = [
  {
    month: 'Month 1',
    weeks: 'Weeks 1-4',
    focus: 'Confirm pregnancy and begin antenatal planning early.',
    checklist: ['Book your first obstetric consultation', 'Start folic acid and prenatal vitamins', 'Track bleeding, cramping, and severe nausea'],
    videoUrl: 'https://www.youtube.com/results?search_query=month+1+pregnancy+care+tips',
  },
  {
    month: 'Month 2',
    weeks: 'Weeks 5-8',
    focus: 'Manage morning sickness and establish a rest routine.',
    checklist: ['Ask about safe medicines and supplements', 'Keep hydration steady', 'Use smaller and frequent meals'],
    videoUrl: 'https://www.youtube.com/results?search_query=month+2+pregnancy+care+tips',
  },
  {
    month: 'Month 3',
    weeks: 'Weeks 9-12',
    focus: 'Complete first-trimester screening and protect nutrition.',
    checklist: ['Review scan timeline', 'Avoid alcohol, smoking, and unsafe remedies', 'Discuss thyroid, BP, or diabetes history'],
    videoUrl: 'https://www.youtube.com/results?search_query=month+3+pregnancy+care+tips',
  },
  {
    month: 'Month 4',
    weeks: 'Weeks 13-16',
    focus: 'Support posture, activity, and stable daily habits.',
    checklist: ['Use comfortable walking routines', 'Monitor dizziness and dehydration', 'Keep regular weight checks'],
    videoUrl: 'https://www.youtube.com/results?search_query=month+4+pregnancy+care+tips',
  },
  {
    month: 'Month 5',
    weeks: 'Weeks 17-20',
    focus: 'Follow the anomaly scan and notice early movement patterns.',
    checklist: ['Attend scan appointments on time', 'Discuss pain or unusual discharge', 'Maintain calcium and iron intake'],
    videoUrl: 'https://www.youtube.com/results?search_query=month+5+pregnancy+care+tips',
  },
  {
    month: 'Month 6',
    weeks: 'Weeks 21-24',
    focus: 'Watch swelling, back strain, and glucose screening needs.',
    checklist: ['Discuss gestational diabetes testing', 'Use side sleeping support', 'Report headaches or blurred vision'],
    videoUrl: 'https://www.youtube.com/results?search_query=month+6+pregnancy+care+tips',
  },
  {
    month: 'Month 7',
    weeks: 'Weeks 25-28',
    focus: 'Prepare for the third trimester and recognize preterm signs.',
    checklist: ['Learn kick-count basics', 'Review vaccination and supplement advice', 'Watch for contractions or leaking fluid'],
    videoUrl: 'https://www.youtube.com/results?search_query=month+7+pregnancy+care+tips',
  },
  {
    month: 'Month 8',
    weeks: 'Weeks 29-32',
    focus: 'Start hospital readiness and labor planning.',
    checklist: ['Pack reports and essentials', 'Discuss birth plan preferences', 'Practice breathing and relaxation routines'],
    videoUrl: 'https://www.youtube.com/results?search_query=month+8+pregnancy+care+tips',
  },
  {
    month: 'Month 9',
    weeks: 'Weeks 33-40',
    focus: 'Stay alert for labor signs and keep follow-ups consistent.',
    checklist: ['Monitor baby movement daily', 'Keep transport and emergency contacts ready', 'Know when to go to the hospital'],
    videoUrl: 'https://www.youtube.com/results?search_query=month+9+pregnancy+care+tips',
  },
];

export default function MaternityCareGuide() {
  return (
    <div
      className="min-h-screen px-4 pb-14 sm:px-6 lg:px-8"
      style={{
        paddingTop: 'calc(var(--app-navbar-offset, 88px) + 2.5rem)',
        background: 'linear-gradient(180deg, #fff7fb 0%, #fffaf5 34%, #f8fafc 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl">
        <header className="relative overflow-hidden rounded-3xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-700 via-pink-600 to-rose-500 p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-pink-200/20 blur-2xl" />

          <div className="relative z-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-100">Pregnancy Support Guide</p>
              <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Maternity Care</h1>
              <p className="mt-3 max-w-2xl text-sm text-pink-50 sm:text-base">
                A month-wise guide for pregnancy support, practical reminders, and useful video references alongside your clinician's advice.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/20 px-4 py-3 text-sm font-semibold backdrop-blur">
                <Calendar className="h-4 w-4" />
                9-Month Journey
              </div>
              <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Trimester Ready
              </div>
            </div>
          </div>
        </header>

        <main className="mt-8 space-y-8">
          <section className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Trimester 1', description: 'Confirm care plan, support nausea, and establish supplements early.' },
              { title: 'Trimester 2', description: 'Follow scans, monitor movement, and strengthen daily routine.' },
              { title: 'Trimester 3', description: 'Prepare for delivery, track warning signs, and stay follow-up ready.' },
            ].map((item) => (
              <article key={item.title} className="rounded-3xl border border-pink-100 bg-white/90 p-5 shadow-sm">
                <div className="mb-4 inline-flex rounded-2xl bg-pink-50 p-3 text-pink-600">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {monthWiseGuides.map((guide) => (
              <article key={guide.month} className="rounded-3xl border border-fuchsia-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-500">{guide.weeks}</p>
                    <h2 className="mt-2 text-xl font-black text-slate-900">{guide.month}</h2>
                  </div>
                  <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-[11px] font-semibold text-fuchsia-700">Month guide</span>
                </div>

                <p className="mt-4 text-sm font-medium text-slate-700">{guide.focus}</p>
                <ul className="mt-4 space-y-2">
                  {guide.checklist.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={guide.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-fuchsia-200 bg-fuchsia-50 px-4 py-2 text-sm font-semibold text-fuchsia-700 transition hover:bg-fuchsia-100"
                >
                  <ExternalLink className="h-4 w-4" />
                  Watch Month Videos
                </a>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
              <ShieldAlert className="h-6 w-6 text-rose-600" />
              Emergency Warning Signs
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                'Heavy bleeding or severe abdominal pain',
                'Reduced fetal movement in later pregnancy',
                'Severe headache, blurred vision, or sudden swelling',
                'Leaking fluid, breathing trouble, or seizures',
              ].map((warning) => (
                <div key={warning} className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm font-medium text-slate-700">
                  {warning}
                </div>
              ))}
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