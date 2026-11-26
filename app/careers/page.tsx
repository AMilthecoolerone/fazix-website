import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { listJobs } from '@/lib/jobs';
import { isJobAcceptingApplications } from '@/lib/careerForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Careers & Staff | FAZIX Esports',
  description: 'Open staff, content, coaching and player positions at FAZIX Esports.',
};

export default async function CareersPage({ searchParams }: { searchParams: Promise<{ team?: string }> }) {
  const jobs = (await listJobs()).filter(isJobAcceptingApplications);
  const departments = Array.from(new Set(jobs.map((j) => j.department))).sort();
  const { team } = await searchParams;
  const active = team && departments.includes(team) ? team : null;
  const shown = active ? jobs.filter((j) => j.department === active) : jobs;

  return (
    <div className="cr-page">
      <Navbar />
      <main className="container cr-wrap">
        <header className="cr-hero">
          <h1>Work with FAZIX</h1>
          <p>
            Staff, content, coaching and player roles. Most positions are remote and volunteer-based. Pick a role, answer a few
            questions, and we&apos;ll get back to you on Discord.
          </p>
        </header>

        {departments.length > 1 && (
          <nav className="cr-filter" aria-label="Filter by department">
            <Link href="/careers" className={!active ? 'is-on' : ''} aria-current={!active ? 'page' : undefined}>
              All roles <span>{jobs.length}</span>
            </Link>
            {departments.map((d) => (
              <Link key={d} href={`/careers?team=${encodeURIComponent(d)}`} className={active === d ? 'is-on' : ''} aria-current={active === d ? 'page' : undefined}>
                {d} <span>{jobs.filter((j) => j.department === d).length}</span>
              </Link>
            ))}
          </nav>
        )}

        {shown.length === 0 ? (
          <div className="cr-empty">
            <p>There are no open positions right now.</p>
            <p>
              Follow us on Discord to hear first when something opens, or <Link href="/apply">apply for a player tryout</Link>.
            </p>
          </div>
        ) : (
          <ul className="cr-list">
            {shown.map((job) => (
              <li key={job.id}>
                <Link href={`/careers/${job.slug}`} className="cr-row">
                  <span className="cr-row-title">{job.title}</span>
                  <span className="cr-row-summary">{job.summary}</span>
                  <span className="cr-row-meta">
                    {[job.department, job.employmentType, job.location, job.commitment].filter(Boolean).join(' / ')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
