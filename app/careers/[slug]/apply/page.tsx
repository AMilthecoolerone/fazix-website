import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getJobBySlug, hasApplied } from '@/lib/jobs';
import { getSession } from '@/lib/session';
import { isJobAcceptingApplications } from '@/lib/careerForm';
import { ApplicationForm } from '@/components/careers/ApplicationForm';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobBySlug((await params).slug);
  return { title: job ? `Apply: ${job.title} | FAZIX Careers` : 'Role not found | FAZIX Esports', robots: { index: false } };
}

export default async function ApplyPage({ params }: Props) {
  const job = await getJobBySlug((await params).slug);
  if (!job || !isJobAcceptingApplications(job)) notFound();
  const session = await getSession();
  const already = session ? await hasApplied(job.id, session.id) : false;

  return (
    <div className="cr-page">
      <Navbar />
      <main className="container cr-wrap cr-applywrap">
        <Link href={`/careers/${job.slug}`} className="cr-back">
          <ArrowLeft size={16} /> {job.title}
        </Link>
        <p className="cr-job-dept">Apply</p>
        <h1 className="cr-apply-title">{job.title}</h1>
        {already ? (
          <div className="af-done">
            <h2>You&apos;ve already applied</h2>
            <p>We have your application for this role. The team will contact you on Discord.</p>
            <Link href="/careers">See other open roles</Link>
          </div>
        ) : (
          <ApplicationForm
            slug={job.slug}
            jobTitle={job.title}
            sections={job.sections}
            requireDiscord={job.requireDiscord}
            applicant={session ? { name: session.displayName, username: session.username, avatarUrl: session.avatarUrl, email: session.email } : null}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
