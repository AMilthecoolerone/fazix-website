'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckCircle2, ArrowLeft, Trophy, Target, Send, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';

export default function ApplyPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;

  const [role, setRole] = useState<'main' | 'academy' | 'creator'>('main');
  const [ign, setIgn] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [discord, setDiscord] = useState('');
  const [trackerUrl, setTrackerUrl] = useState('');
  const [competitiveExp, setCompetitiveExp] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMessage(t.apply.consentError);
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          ign,
          fullName,
          age,
          country,
          discord,
          trackerUrl,
          competitiveExp,
          notes,
          consent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to submit application. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Forward directly to fazixesports@gmail.com via Web3Forms from the browser
      const web3Key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '821b6b58-3db1-4b64-9b47-acad70852981';
      if (web3Key) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `[FAZIX Application] ${role.toUpperCase()} Trial: ${ign} (${discord})`,
            from_name: fullName ? `${fullName} (${ign})` : ign,
            email: 'fazixesports@gmail.com',
            role,
            ign,
            full_name: fullName || 'N/A',
            age,
            country,
            discord,
            tracker_url: trackerUrl || 'N/A',
            message: `Role: ${role.toUpperCase()}\nIGN: ${ign}\nFull Name: ${fullName || 'N/A'}\nAge: ${age}\nCountry: ${country}\nDiscord: ${discord}\nTracker: ${trackerUrl || 'N/A'}\n\nCompetitive Experience:\n${competitiveExp || 'N/A'}\n\nNotes & Availability:\n${notes || 'N/A'}`,
          }),
        }).catch((err) => console.warn('Web3Forms dispatch warning:', err));
      }

      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErrorMessage('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#FFFFFF', fontFamily: 'var(--font-helvetica)' }}>
      {/* Top Navigation */}
      <Navbar />

      <main style={{ padding: '60px 0 100px 0' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '24px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#9094A0',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: 500,
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9094A0')}
            >
              <ArrowLeft size={16} /> {t.apply.backHome}
            </Link>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '44px' }}>
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                marginBottom: '16px'
              }}
            >
              {t.apply.title}
            </h1>
            <p style={{ color: '#9E9EA8', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '720px' }}>
              {t.apply.subtitle}
            </p>
          </div>

          {/* Trial Benchmarks Overview */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '48px'
            }}
          >
            <div
              className="clean-card"
              style={{
                padding: '22px',
                backgroundColor: '#0C0C10',
                border: '1px solid #202028'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Trophy size={18} color="#FF5900" />
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{t.apply.tierMainTitle}</h2>
              </div>
              <ul style={{ paddingLeft: '18px', color: '#8E8E98', fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>
                <li>GC2+ (1,700+ Peak MMR)</li>
                <li>Age 13+</li>
                <li>EU servers, preferrably good ping</li>
                <li>Scrim availability</li>
              </ul>
            </div>

            <div
              className="clean-card"
              style={{
                padding: '22px',
                backgroundColor: '#0C0C10',
                border: '1px solid #202028'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Target size={18} color="#FFFFFF" />
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{t.apply.tierAcademyTitle}</h2>
              </div>
              <ul style={{ paddingLeft: '18px', color: '#8E8E98', fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>
                <li>Dia+ (835 MMR)</li>
                <li>Active, reliable, mature, & respectful</li>
                <li>Team player, open to criticism, & willing to learn</li>
                <li>Available for weekly tournaments</li>
              </ul>
            </div>
          </div>

          {/* Form or Confirmation State */}
          {submitted ? (
            <div
              className="clean-card"
              style={{
                padding: 'clamp(28px, 5vw, 50px) clamp(18px, 4vw, 36px)',
                backgroundColor: '#0E0E14',
                border: '1px solid #282834',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 89, 0, 0.12)',
                  border: '1px solid rgba(255, 89, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto'
                }}
              >
                <CheckCircle2 size={32} color="#FF5900" />
              </div>

              <h2 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2rem)', fontWeight: 700, marginBottom: '12px', color: '#FFFFFF' }}>
                {t.apply.successTitle}
              </h2>
              <p
                style={{
                  color: '#9E9EA8',
                  fontSize: '1.02rem',
                  lineHeight: 1.6,
                  maxWidth: '560px',
                  margin: '0 auto 30px auto'
                }}
              >
                {t.apply.successDesc}
              </p>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  href="/"
                  className="btn btn-white"
                  style={{ padding: '14px 30px', fontWeight: 700, textDecoration: 'none' }}
                >
                  {t.apply.backBtn}
                </Link>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setIgn('');
                    setFullName('');
                    setTrackerUrl('');
                    setCompetitiveExp('');
                    setNotes('');
                  }}
                  className="btn btn-outline"
                  style={{ padding: '14px 26px', fontWeight: 600 }}
                >
                  {t.apply.submitAnother}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="clean-card"
              style={{
                padding: 'clamp(20px, 4vw, 40px)',
                backgroundColor: '#0C0C10',
                border: '1px solid #22222C',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              {/* Role Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#D4D4DC', marginBottom: '10px' }}>
                  {t.apply.positionLabel}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  {[
                    { id: 'main', label: t.apply.posMain },
                    { id: 'academy', label: t.apply.posAcademy },
                    { id: 'creator', label: t.apply.posCreator }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as any)}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: role === item.id ? '#FFFFFF' : '#14141A',
                        color: role === item.id ? '#000000' : '#A0A0A8',
                        border: '1px solid',
                        borderColor: role === item.id ? '#FFFFFF' : '#282834',
                        borderRadius: '6px',
                        fontFamily: 'var(--font-helvetica)',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A0A0A8', marginBottom: '8px' }}>
                    {t.apply.ignLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    placeholder="e.g. Frxzen"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: '#14141A',
                      border: '1px solid #282834',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-helvetica)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A0A0A8', marginBottom: '8px' }}>
                    {t.apply.realNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Julian"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: '#14141A',
                      border: '1px solid #282834',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-helvetica)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A0A0A8', marginBottom: '8px' }}>
                    {t.apply.ageLabel} *
                  </label>
                  <input
                    type="number"
                    required
                    min="12"
                    max="45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 18"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: '#14141A',
                      border: '1px solid #282834',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-helvetica)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A0A0A8', marginBottom: '8px' }}>
                    {t.apply.countryLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Germany (EU servers)"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: '#14141A',
                      border: '1px solid #282834',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-helvetica)'
                    }}
                  />
                </div>
              </div>

              {/* Competitive Credentials */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A0A0A8', marginBottom: '8px' }}>
                    {t.apply.discordLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    placeholder="e.g. frxzen.rl"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: '#14141A',
                      border: '1px solid #282834',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-helvetica)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A0A0A8', marginBottom: '8px' }}>
                    {t.apply.trackerLabel} *
                  </label>
                  <input
                    type="url"
                    required
                    value={trackerUrl}
                    onChange={(e) => setTrackerUrl(e.target.value)}
                    placeholder="https://rocketleague.tracker.network/..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: '#14141A',
                      border: '1px solid #282834',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-helvetica)'
                    }}
                  />
                </div>
              </div>

              {/* Competitive Track Record */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A0A0A8', marginBottom: '8px' }}>
                  {t.apply.expLabel} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={competitiveExp}
                  onChange={(e) => setCompetitiveExp(e.target.value)}
                  placeholder="Past RLCS open qualifiers, weekly EU tournaments, 6mans rank, and previous teams."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#14141A',
                    border: '1px solid #282834',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    fontFamily: 'var(--font-helvetica)',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Notes / Availability */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A0A0A8', marginBottom: '8px' }}>
                  {t.apply.notesLabel}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Your usual evening schedule (CET) and any additional context for our team."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#14141A',
                    border: '1px solid #282834',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    fontFamily: 'var(--font-helvetica)',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* DSGVO Consent Checkbox */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#121218',
                  border: '1px solid #242432',
                  borderRadius: '6px',
                }}
              >
                <input
                  type="checkbox"
                  id="apply-consent-checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#FF5900',
                    marginTop: '2px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
                <label
                  htmlFor="apply-consent-checkbox"
                  style={{
                    fontSize: '0.82rem',
                    color: '#B0B0BC',
                    lineHeight: 1.5,
                    cursor: 'pointer',
                    margin: 0,
                  }}
                >
                  {t.apply.consentText}{' '}
                  <Link href="/privacy" target="_blank" style={{ color: '#FF701E', textDecoration: 'underline' }}>
                    {t.footer.privacy}
                  </Link>{' '}
                  *
                </label>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div
                  style={{
                    padding: '14px 18px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '6px',
                    color: '#FCA5A5',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0, color: '#EF4444' }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div style={{ paddingTop: '8px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-white"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? (
                    t.apply.submittingBtn
                  ) : (
                    <>
                      {t.apply.submitBtn} <Send size={18} />
                    </>
                  )}
                </button>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.78rem', color: '#6A6A74' }}>
                  {t.apply.reviewNote}
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* PlayVS Reference Footer */}
      <Footer />
    </div>
  );
}
