import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { listJobs } from '@/lib/jobs';
import { ArrowRight, Briefcase, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Jobs | FAZIX Esports',
  description: 'Open staff, content and esports positions at FAZIX Esports.',
};

export default async function JobsPage() {
  const jobs = await listJobs({ publicOnly: true });
  const departments = Array.from(new Set(jobs.map((j) => j.department)));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'var(--font-helvetica)' }}>
      <Navbar />
      <main style={{ padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <p style={{ color: 'var(--color-orange)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
            Careers
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '10px 0 12px' }}>
            Join the team behind FAZIX
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '560px', lineHeight: 1.6, margin: '0 0 44px' }}>
            Staff, content and esports roles. Pick a position, answer a few questions, and the team will get back to you on Discord.
          </p>

          {jobs.length === 0 ? (
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '40px 24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No open positions right now. Check back soon, or{' '}
              <Link href="/apply" style={{ color: '#fff' }}>apply for a tryout</Link>.
            </div>
          ) : (
            departments.map((dept) => (
              <section key={dept} style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>
                  {dept}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {jobs
                    .filter((j) => j.department === dept)
                    .map((job) => (
                      <Link key={job.id} href={`/jobs/${job.id}`} className="job-row">
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{job.title}</div>
                          {job.summary && (
                            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginTop: '4px', lineHeight: 1.5 }}>{job.summary}</div>
                          )}
                          <div style={{ display: 'flex', gap: '14px', marginTop: '10px', color: 'var(--color-text-muted)', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Briefcase size={13} /> {job.type}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><MapPin size={13} /> {job.location}</span>
                          </div>
                        </div>
                        <ArrowRight size={18} style={{ flexShrink: 0 }} />
                      </Link>
                    ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
