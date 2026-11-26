import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getJobBySlug } from '@/lib/jobs';
import { getSession, isStaff } from '@/lib/session';
import { isJobAcceptingApplications } from '@/lib/careerForm';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobBySlug((await params).slug);
  if (!job || job.status === 'draft') return { title: 'Role not found | FAZIX Esports' };
  return { title: `${job.title} | FAZIX Careers`, description: job.summary || `Apply for ${job.title} at FAZIX Esports.` };
}

function Block({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="cr-block">
      <h2>{title}</h2>
      <ul>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobPage({ params }: Props) {
  const job = await getJobBySlug((await params).slug);
  const staffPreview = job?.status === 'draft' && isStaff(await getSession());
  if (!job || (job.status === 'draft' && !staffPreview)) notFound();
  const open = isJobAcceptingApplications(job);

  return (
    <div className="cr-page">
      <Navbar />
      <main className="container cr-wrap cr-job">
        <Link href="/careers" className="cr-back">
          <ArrowLeft size={16} /> All roles
        </Link>
        {staffPreview && <p className="cr-note">Draft preview. Only staff can see this page until the role is opened.</p>}

        <header className="cr-job-head">
          <p className="cr-job-dept">{job.department}</p>
          <h1>{job.title}</h1>
          <dl className="cr-facts">
            <div><dt>Type</dt><dd>{job.employmentType}</dd></div>
            <div><dt>Location</dt><dd>{job.location}</dd></div>
            {job.commitment && <div><dt>Time</dt><dd>{job.commitment}</dd></div>}
            {job.closesAt && open && (
              <div><dt>Apply by</dt><dd>{new Date(job.closesAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</dd></div>
            )}
          </dl>
          {open ? (
            <Link href={`/careers/${job.slug}/apply`} className="cr-apply">Apply for this role</Link>
          ) : (
            <p className="cr-closed">This role is no longer taking applications.</p>
          )}
        </header>

        {job.about && <section className="cr-block cr-about">{job.about}</section>}
        <Block title="What you'll do" items={job.responsibilities} />
        <Block title="What we're looking for" items={job.requirements} />
        <Block title="Nice to have" items={job.niceToHave} />
        <Block title="What you get" items={job.perks} />

        {open && (
          <div className="cr-bottom">
            <Link href={`/careers/${job.slug}/apply`} className="cr-apply">Apply for this role</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
