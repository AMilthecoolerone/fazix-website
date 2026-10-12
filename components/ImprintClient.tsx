'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { type LanguageCode } from '@/lib/translations';
import { ArrowLeft, Building, Mail, ShieldCheck, Scale, Globe } from 'lucide-react';

interface ImprintContent {
  backHome: string;
  badge: string;
  title: string;
  subtitle: string;
  secCompanyTitle: string;
  secContactTitle: string;
  secEditorialTitle: string;
  secDisputeTitle: string;
  secDisputeText: string;
  secLiabilityTitle: string;
  secLiabilityText: string;
}

const IMPRINT_TRANSLATIONS: Record<LanguageCode, ImprintContent> = {
  EN: {
    backHome: 'Back to Fazix Home',
    badge: 'LEGAL DISCLOSURE (§ 5 DDG)',
    title: 'LEGAL NOTICE',
    subtitle: 'Information pursuant to § 5 of the German Digital Services Act (DDG) and § 18 of the State Media Treaty (MStV).',
    secCompanyTitle: 'Provider Information (§ 5 DDG)',
    secContactTitle: 'Contact',
    secEditorialTitle: 'Responsible for editorial content pursuant to Section 18(2) MStV',
    secDisputeTitle: 'Consumer Dispute Resolution (§ 36 VSBG)',
    secDisputeText:
      'The European Commission provided a platform for Online Dispute Resolution (ODR). Please note that pursuant to Regulation (EU) 2024/2747, the European Commission has discontinued the ODR platform. We are neither willing nor obligated to participate in dispute resolution proceedings before a consumer arbitration board pursuant to § 36 of the German Consumer Dispute Resolution Act (VSBG).',
    secLiabilityTitle: 'Liability for Content & External Links',
    secLiabilityText:
      'As a service provider, we are responsible for our own content on these pages under the applicable laws, in particular Section 7(1) of the German Digital Services Act (DDG) and Art. 4-8 Regulation (EU) 2022/2065 (Digital Services Act - DSA). Obligations to remove or block the use of information under applicable laws remain unaffected.\n\nLiability for External Links: This website may contain links to external third-party websites. We have no control over the content of these websites and therefore cannot assume responsibility for their content. The respective provider or operator of the linked websites is responsible for their content. If we become aware of any legal violations, we will review the relevant links and take appropriate action where required by law.'
  },
  DE: {
    backHome: 'Zurück zur Startseite',
    badge: 'RECHTLICHE ANGABEN (§ 5 DDG)',
    title: 'IMPRESSUM',
    subtitle: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Medienstaatsvertrag (MStV).',
    secCompanyTitle: 'Angaben gemäß § 5 DDG',
    secContactTitle: 'Kontakt',
    secEditorialTitle: 'Verantwortlich für journalistisch-redaktionelle Inhalte gemäß § 18 Abs. 2 MStV',
    secDisputeTitle: 'Verbraucherstreitbeilegung (§ 36 VSBG)',
    secDisputeText:
      'Die Europäische Kommission stellte eine Plattform zur Online-Streitbeilegung (OS) bereit. Hinweis zur Beendigung: Gemäß Verordnung (EU) 2024/2747 wurde die OS-Plattform der Europäischen Kommission eingestellt. Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).',
    secLiabilityTitle: 'Haftung für Inhalte und Links',
    secLiabilityText:
      'Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen und dem Digital Services Act (DSA, VO (EU) 2022/2065) verantwortlich. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.\n\nHaftung für externe Links: Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.'
  },
  FR: {
    backHome: 'Retour à l’accueil',
    badge: 'MENTIONS LÉGALES (§ 5 DDG)',
    title: 'MENTIONS LÉGALES',
    subtitle: 'Informations fournies conformément au § 5 de la loi allemande sur les services numériques (DDG) et au § 18 du traité d’État sur les médias (MStV).',
    secCompanyTitle: 'Informations selon le § 5 DDG',
    secContactTitle: 'Contact',
    secEditorialTitle: 'Responsable des contenus éditoriaux selon le § 18 al. 2 MStV',
    secDisputeTitle: 'Règlement des litiges de consommation (§ 36 VSBG)',
    secDisputeText:
      'La Commission européenne mettait à disposition une plateforme de règlement en ligne des litiges (RLL). Conformément au règlement (UE) 2024/2747, cette plateforme a été fermée. Nous ne sommes ni disposés ni tenus de participer à des procédures de conciliation devant un organisme de règlement des litiges de consommation (§ 36 VSBG).',
    secLiabilityTitle: 'Responsabilité pour les contenus et les liens',
    secLiabilityText:
      'En tant que prestataire, nous sommes responsables de nos propres contenus conformément au § 7 al. 1 DDG selon les lois générales et le Digital Services Act (DSA, règlement (UE) 2022/2065). En vertu des dispositions applicables, nous ne sommes pas tenus de surveiller en permanence les informations transmises ou stockées par des tiers.'
  },
  ES: {
    backHome: 'Volver al inicio',
    badge: 'INFORMACIÓN LEGAL (§ 5 DDG)',
    title: 'AVISO LEGAL',
    subtitle: 'Información conforme al § 5 de la Ley alemana de Servicios Digitales (DDG) y al § 18 del Tratado Estatal de Medios (MStV).',
    secCompanyTitle: 'Datos de la organización según el § 5 DDG',
    secContactTitle: 'Contacto',
    secEditorialTitle: 'Responsable del contenido editorial según el § 18 párr. 2 MStV',
    secDisputeTitle: 'Resolución de litigios de consumo (§ 36 VSBG)',
    secDisputeText:
      'La Comisión Europea disponía de una plataforma de resolución de litigios en línea (RLL). Conforme al Reglamento (UE) 2024/2747, dicha plataforma ha sido descontinuada. No estamos dispuestos ni obligados a participar en procedimientos de resolución de conflictos ante una junta arbitral de consumo (§ 36 VSBG).',
    secLiabilityTitle: 'Responsabilidad por contenidos y enlaces',
    secLiabilityText:
      'Como proveedores de servicios, somos responsables de nuestros propios contenidos en estas páginas según la legislación general conforme al § 7 párr. 1 DDG y el Digital Services Act (DSA, Reglamento (UE) 2022/2065). No estamos obligados a supervisar continuamente información externa transmitida o almacenada.'
  }
};

export function ImprintClient() {
  const { language } = useLanguage();
  const t = IMPRINT_TRANSLATIONS[language] || IMPRINT_TRANSLATIONS.EN;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        fontFamily: 'var(--font-helvetica)'
      }}
    >
      <Navbar />

      <main style={{ padding: '60px 0 100px 0' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
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
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9094A0')}
            >
              <ArrowLeft size={16} /> {t.backHome}
            </Link>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'rgba(255, 89, 0, 0.12)',
                border: '1px solid rgba(255, 89, 0, 0.3)',
                borderRadius: '999px',
                color: '#FF701E',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '18px'
              }}
            >
              <Building size={14} /> {t.badge}
            </div>
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '16px'
              }}
            >
              {t.title}
            </h1>
            <p style={{ color: '#9E9EA8', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
              {t.subtitle}
            </p>
          </div>

          <div
            className="clean-card"
            style={{
              padding: 'clamp(24px, 4vw, 44px)',
              backgroundColor: '#0E0E14',
              border: '1px solid #242430',
              borderRadius: '12px',
              lineHeight: 1.7,
              color: '#D0D0DC',
              fontSize: '0.94rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px'
            }}
          >
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secCompanyTitle}
              </h2>
              <p style={{ margin: 0 }}>
                <strong>Angaben zum Anbieter:</strong><br />
                Jason Gabriel<br />
                Spillingsbreede 10<br />
                32429 Minden<br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secContactTitle}
              </h2>
              <p style={{ margin: 0 }}>
                E-Mail: <a href="mailto:fazixesports@gmail.com" style={{ color: '#FF701E' }}>fazixesports@gmail.com</a><br />
                Website: <a href="https://fazix-esport.xyz" style={{ color: '#FF701E' }}>https://fazix-esport.xyz</a><br />
                Community & Support: <a href="https://discord.gg/UdnGPHmvcT" target="_blank" rel="noopener noreferrer" style={{ color: '#FF701E' }}>discord.gg/UdnGPHmvcT</a>
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secEditorialTitle}
              </h2>
              <p style={{ margin: 0 }}>
                Verantwortlich für journalistisch-redaktionelle Inhalte gemäß § 18 Abs. 2 MStV:<br />
                Jason Gabriel<br />
                Spillingsbreede 10<br />
                32429 Minden<br />
                Deutschland<br />
                E-Mail: <a href="mailto:fazixesports@gmail.com" style={{ color: '#FF701E' }}>fazixesports@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secDisputeTitle}
              </h2>
              <p style={{ margin: 0 }}>
                {t.secDisputeText}
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secLiabilityTitle}
              </h2>
              <p style={{ margin: 0, whiteSpace: 'pre-line' }}>
                {t.secLiabilityText}
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
