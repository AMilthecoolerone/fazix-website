import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getJob } from '@/lib/jobs';
import { getSession } from '@/lib/session';
import { JobApplyForm } from '@/components/jobs/JobApplyForm';
import { ArrowLeft, Briefcase, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob((await params).id);
  return job?.status === 'open'
    ? { title: `${job.title} | FAZIX Jobs`, description: job.summary || `Apply for ${job.title} at FAZIX Esports.` }
    : { title: 'Job not found | FAZIX Esports' };
}

export default async function JobPage({ params }: Props) {
  const job = await getJob((await params).id);
  if (!job || job.status !== 'open') notFound();
  const session = await getSession();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'var(--font-helvetica)' }}>
      <Navbar />
      <main style={{ padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.88rem' }}>
            <ArrowLeft size={16} /> All jobs
          </Link>

          <p style={{ color: 'var(--color-orange)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '28px 0 0' }}>
            {job.department}
          </p>
          <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '8px 0 14px' }}>{job.title}</h1>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--color-text-secondary)', fontSize: '0.88rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Briefcase size={14} /> {job.type}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {job.location}</span>
          </div>

          {job.description && (
            <div style={{ marginTop: '32px', color: '#D4D4DA', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{job.description}</div>
          )}

          {job.requirements.length > 0 && (
            <>
              <h2 style={{ fontSize: '1.1rem', margin: '32px 0 12px' }}>What we&apos;re looking for</h2>
              <ul style={{ color: '#D4D4DA', lineHeight: 1.7, paddingLeft: '20px', margin: 0 }}>
                {job.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '44px 0 32px' }} />
          <h2 style={{ fontSize: '1.4rem', margin: '0 0 20px' }}>Apply</h2>
          <JobApplyForm
            jobId={job.id}
            questions={job.questions}
            defaults={session && !session.isDemo ? { name: session.displayName, discord: session.username, email: session.email || '' } : undefined}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
