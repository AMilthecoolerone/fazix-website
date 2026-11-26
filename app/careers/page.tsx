import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { listJobs } from '@/lib/jobs';
import { isJobAcceptingApplications } from '@/lib/careerForm';
import { ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Careers & Staff | FAZIX Esports',
  description: 'Open staff, content, coaching and player positions at FAZIX Esports.',
};

const DISCORD_URL = 'https://discord.gg/UdnGPHmvcT';

export default async function CareersPage({ searchParams }: { searchParams: Promise<{ team?: string }> }) {
  const jobs = (await listJobs()).filter(isJobAcceptingApplications);
  const departments = Array.from(new Set(jobs.map((j) => j.department))).sort();
  const { team } = await searchParams;
  const active = team && departments.includes(team) ? team : null;
  const shown = active ? jobs.filter((j) => j.department === active) : jobs;

  return (
    <div className="cr-page">
      <Navbar />

      <header className="cr-hero">
        <div className="container cr-hero-inner">
          <h1 className="cr-display">Careers &amp; Staff</h1>
          <p>
            Help run a Rocket League club competing in RLCS Europe. We&apos;re looking for staff, creators, coaches and players.
            Most roles are remote and volunteer-based.
          </p>
          <div className="cr-hero-actions">
            <a href="#roles" className="cr-btn is-primary">
              {jobs.length === 0 ? 'No open roles right now' : jobs.length === 1 ? 'See the open role' : `See ${jobs.length} open roles`}
            </a>
            <a href={DISCORD_URL} className="cr-btn" target="_blank" rel="noopener noreferrer">
              Join our Discord <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </header>

      <main className="container cr-main">
        <section id="roles" className="cr-roles" aria-labelledby="cr-roles-title">
          <div className="cr-roles-head">
            <h2 id="cr-roles-title">Open roles</h2>
            {departments.length > 1 && (
              <nav className="cr-filter" aria-label="Filter by department">
                <Link href="/careers#roles" scroll={false} className={!active ? 'is-on' : ''} aria-current={!active ? 'page' : undefined}>
                  All <span>{jobs.length}</span>
                </Link>
                {departments.map((d) => (
                  <Link key={d} href={`/careers?team=${encodeURIComponent(d)}#roles`} scroll={false} className={active === d ? 'is-on' : ''} aria-current={active === d ? 'page' : undefined}>
                    {d} <span>{jobs.filter((j) => j.department === d).length}</span>
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {shown.length === 0 ? (
            <div className="cr-empty">
              <h3>Nothing open right now</h3>
              <p>New roles are announced on our Discord first. You can also apply for a player tryout any time.</p>
              <div className="cr-hero-actions">
                <a href={DISCORD_URL} className="cr-btn is-primary" target="_blank" rel="noopener noreferrer">Join our Discord</a>
                <Link href="/apply" className="cr-btn">Player tryouts</Link>
              </div>
            </div>
          ) : (
            <ul className="cr-grid">
              {shown.map((job) => (
                <li key={job.id}>
                  <Link href={`/careers/${job.slug}`} className="cr-card">
                    <span className="cr-card-dept">{job.department}</span>
                    <span className="cr-card-title">{job.title}</span>
                    {job.summary && <span className="cr-card-summary">{job.summary}</span>}
                    <span className="cr-card-foot">
                      <span className="cr-tags">
                        {[job.employmentType, job.location, job.commitment].filter(Boolean).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </span>
                      <span className="cr-card-arrow" aria-hidden="true">
                        <ArrowUpRight size={18} />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="cr-how" aria-labelledby="cr-how-title">
          <h2 id="cr-how-title">How applying works</h2>
          <ol>
            <li>
              <strong>Apply online</strong>
              <span>Pick a role and answer a few questions. Takes about 10 minutes.</span>
            </li>
            <li>
              <strong>We review</strong>
              <span>Staff read every application, usually within a week.</span>
            </li>
            <li>
              <strong>Talk on Discord</strong>
              <span>If it&apos;s a fit, we message you for a call or a trial period.</span>
            </li>
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  );
}
