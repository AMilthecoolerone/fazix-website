'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { TRANSLATIONS } from '@/lib/translations';
import {
  ArrowLeft,
  Mail,
  Building2,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Disc as DiscordIcon,
} from 'lucide-react';



export default function ContactPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;

  const categories = [
    t.contact.catPartnership,
    t.contact.catTransfers,
    t.contact.catTournaments,
    t.contact.catPress,
    t.contact.catGeneral,
  ];

  const [category, setCategory] = useState(categories[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMessage(t.contact.consentError);
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category || categories[0],
          name,
          email,
          organization,
          subject,
          message,
          consent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
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
            subject: `[FAZIX Contact] ${category || categories[0]}: ${subject || 'New Inquiry'} (${name})`,
            from_name: name,
            email,
            replyto: email,
            category: category || categories[0],
            organization: organization || 'N/A',
            message: `From: ${name} (${email})\nOrganization: ${organization || 'N/A'}\nTopic: ${category || categories[0]}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`,
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
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        fontFamily: 'var(--font-helvetica)',
      }}
    >
      <Navbar />

      <main style={{ padding: '60px 0 100px 0' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '28px' }}>
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
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9094A0')}
            >
              <ArrowLeft size={16} /> {t.contact.backHome}
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
                marginBottom: '16px',
              }}
            >
              {t.contact.title}
            </h1>
            <p
              style={{
                color: '#9E9EA8',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                maxWidth: '720px',
              }}
            >
              {t.contact.subtitle}
            </p>
          </div>


          <div className="contact-layout-grid">
            {/* Form Column */}
            <div>
              {submitted ? (
                <div
                  className="clean-card"
                  style={{
                    padding: 'clamp(28px, 5vw, 50px) clamp(18px, 4vw, 36px)',
                    backgroundColor: '#0E0E14',
                    border: '1px solid #282834',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 89, 0, 0.1)',
                      border: '1px solid #FF5900',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px auto',
                      color: '#FF5900',
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>
                  <h2
                    style={{
                      fontSize: 'clamp(1.4rem, 4vw, 1.7rem)',
                      fontWeight: 700,
                      marginBottom: '12px',
                    }}
                  >
                    {t.contact.successTitle}
                  </h2>
                  <p
                    style={{
                      color: '#A0A0A8',
                      fontSize: '0.98rem',
                      lineHeight: 1.6,
                      maxWidth: '520px',
                      margin: '0 auto 16px auto',
                    }}
                  >
                    {name ? `${name} · ` : ''}{t.contact.successDesc}
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: 'rgba(255, 89, 0, 0.08)',
                      border: '1px solid rgba(255, 89, 0, 0.25)',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      color: '#FF8844',
                      marginBottom: '26px',
                    }}
                  >
                    <Mail size={14} />
                    <span>Forwarded directly to <strong>fazixesports@gmail.com</strong></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <Link
                      href="/"
                      className="btn btn-white"
                      style={{
                        padding: '12px 24px',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.92rem',
                      }}
                    >
                      {t.apply.backBtn}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setEmail('');
                        setOrganization('');
                        setSubject('');
                        setMessage('');
                      }}
                      className="btn btn-secondary"
                      style={{
                        padding: '12px 24px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                      }}
                    >
                      {t.contact.sendAnother}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="clean-card"
                  style={{
                    padding: 'clamp(20px, 4vw, 36px)',
                    backgroundColor: '#0C0C10',
                    border: '1px solid #202028',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '22px',
                  }}
                >
                  {/* Category Selection */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#A0A0A8',
                        marginBottom: '10px',
                      }}
                    >
                      {t.contact.topicLabel}
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {categories.map((cat) => {
                        const active = category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '4px',
                              fontSize: '0.84rem',
                              fontWeight: active ? 600 : 500,
                              backgroundColor: active ? '#FF5900' : '#14141A',
                              color: active ? '#FFFFFF' : '#8E8E98',
                              border: active ? '1px solid #FF5900' : '1px solid #282834',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#A0A0A8',
                          marginBottom: '8px',
                        }}
                      >
                        {t.contact.nameLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: '#14141A',
                          border: '1px solid #282834',
                          borderRadius: '6px',
                          color: '#FFFFFF',
                          fontSize: '0.92rem',
                          fontFamily: 'var(--font-helvetica)',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#A0A0A8',
                          marginBottom: '8px',
                        }}
                      >
                        {t.contact.emailLabel} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: '#14141A',
                          border: '1px solid #282834',
                          borderRadius: '6px',
                          color: '#FFFFFF',
                          fontSize: '0.92rem',
                          fontFamily: 'var(--font-helvetica)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Organization & Subject Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#A0A0A8',
                          marginBottom: '8px',
                        }}
                      >
                        {t.contact.orgLabel}
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Acme Gaming / Brand Co."
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: '#14141A',
                          border: '1px solid #282834',
                          borderRadius: '6px',
                          color: '#FFFFFF',
                          fontSize: '0.92rem',
                          fontFamily: 'var(--font-helvetica)',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#A0A0A8',
                          marginBottom: '8px',
                        }}
                      >
                        {t.contact.subjectLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Partnership Proposal / EU Scrim Invite"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: '#14141A',
                          border: '1px solid #282834',
                          borderRadius: '6px',
                          color: '#FFFFFF',
                          fontSize: '0.92rem',
                          fontFamily: 'var(--font-helvetica)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#A0A0A8',
                        marginBottom: '8px',
                      }}
                    >
                      {t.contact.messageLabel} *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide specifics regarding your proposal, event schedule, budget scope, or transfer inquiry..."
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        backgroundColor: '#14141A',
                        border: '1px solid #282834',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontSize: '0.92rem',
                        fontFamily: 'var(--font-helvetica)',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {/* DSGVO / Privacy Opt-In Checkbox */}
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
                      id="contact-consent-checkbox"
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
                      htmlFor="contact-consent-checkbox"
                      style={{
                        fontSize: '0.82rem',
                        color: '#B0B0BC',
                        lineHeight: 1.5,
                        cursor: 'pointer',
                        margin: 0,
                      }}
                    >
                      {t.contact.consentText}{' '}
                      <Link href="/privacy" target="_blank" style={{ color: '#FF701E', textDecoration: 'underline' }}>
                        {t.footer.privacy}
                      </Link>{' '}
                      *
                    </label>
                  </div>

                  {/* Error Notification Banner */}
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
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-white"
                      style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                      }}
                    >
                      {isSubmitting ? (
                        t.contact.submittingBtn
                      ) : (
                        <>
                          {t.contact.submitBtn} <Send size={16} />
                        </>
                      )}
                    </button>
                    <div
                      style={{
                        textAlign: 'center',
                        marginTop: '12px',
                        fontSize: '0.78rem',
                        color: '#6A6A74',
                      }}
                    >
                      {t.contact.rateLimitNotice} · All inquiries forward to fazixesports@gmail.com
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar / Info Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                className="clean-card"
                style={{
                  padding: '24px',
                  backgroundColor: '#0C0C10',
                  border: '1px solid #202028',
                  borderRadius: '8px',
                }}
              >
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Building2 size={18} color="#FF5900" />
                  {t.contact.directChannelsTitle}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <MapPin size={16} color="#8E8E98" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#8E8E98' }}>{t.contact.hqTitle}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t.contact.hqDesc}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Mail size={16} color="#8E8E98" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#8E8E98' }}>{t.contact.directEmailTitle}</div>
                      <a
                        href={`mailto:${t.contact.directEmailDesc}`}
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#FF5900',
                          textDecoration: 'none',
                        }}
                      >
                        {t.contact.directEmailDesc}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <DiscordIcon size={16} color="#8E8E98" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#8E8E98' }}>{t.contact.discordTitle}</div>
                      <a
                        href="https://discord.gg/UdnGPHmvcT"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          textDecoration: 'none',
                        }}
                      >
                        discord.gg/UdnGPHmvcT
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Clock size={16} color="#8E8E98" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#8E8E98' }}>{t.contact.responseWindowTitle}</div>
                      <div style={{ fontSize: '0.88rem', color: '#C0C0C8' }}>
                        {t.contact.responseWindowHours}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="clean-card"
                style={{
                  padding: '24px',
                  backgroundColor: '#0C0C10',
                  border: '1px solid #202028',
                  borderRadius: '8px',
                }}
              >
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <MessageSquare size={18} color="#FF5900" />
                  {t.contact.trialsTitle}
                </h3>
                <p style={{ color: '#8E8E98', fontSize: '0.86rem', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  {t.contact.trialsDesc}
                </p>
                <Link
                  href="/apply"
                  style={{
                    display: 'inline-block',
                    padding: '10px 16px',
                    backgroundColor: '#181822',
                    border: '1px solid #303040',
                    borderRadius: '5px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF5900';
                    e.currentTarget.style.color = '#FF5900';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#303040';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  {t.contact.trialsBtn}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
