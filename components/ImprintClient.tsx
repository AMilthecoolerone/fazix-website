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
    badge: 'LEGAL DISCLOSURE (§ 5 TMG)',
    title: 'LEGAL NOTICE',
    subtitle: 'Information pursuant to § 5 of the German Telemedia Act (TMG) and § 18 of the State Media Treaty (MStV).',
    secCompanyTitle: 'Organization & Details according to § 5 TMG',
    secContactTitle: 'Contact',
    secEditorialTitle: 'Responsible for editorial content pursuant to § 18(2) MStV',
    secDisputeTitle: 'EU Online Dispute Resolution',
    secDisputeText:
      'The European Commission provides a platform for online dispute resolution (ODR): https://ec.europa.eu/consumers/odr. You can find our contact email address above. We are neither willing nor obligated to participate in dispute resolution proceedings before a consumer arbitration board.',
    secLiabilityTitle: 'Liability for Content & External Links',
    secLiabilityText:
      'As a service provider, we are responsible for our own content on these pages under general law pursuant to § 7(1) TMG. Pursuant to §§ 8 to 10 TMG, we are not obligated to monitor transmitted or stored third-party information or investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information under general laws remain unaffected.'
  },
  DE: {
    backHome: 'Zurück zur Startseite',
    badge: 'RECHTLICHE ANGABEN (§ 5 TMG)',
    title: 'IMPRESSUM',
    subtitle: 'Angaben gemäß § 5 Telemediengesetz (TMG) und § 18 Medienstaatsvertrag (MStV).',
    secCompanyTitle: 'Angaben gemäß § 5 TMG',
    secContactTitle: 'Kontakt',
    secEditorialTitle: 'Verantwortlich für redaktionelle Inhalte nach § 18 Abs. 2 MStV',
    secDisputeTitle: 'EU-Streitschlichtung',
    secDisputeText:
      'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr. Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    secLiabilityTitle: 'Haftung für Inhalte und Links',
    secLiabilityText:
      'Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.'
  },
  FR: {
    backHome: 'Retour à l’accueil',
    badge: 'MENTIONS LÉGALES (§ 5 TMG)',
    title: 'MENTIONS LÉGALES',
    subtitle: 'Informations fournies conformément au § 5 de la loi allemande sur les télémédias (TMG) et au § 18 du traité d’État sur les médias (MStV).',
    secCompanyTitle: 'Informations selon le § 5 TMG',
    secContactTitle: 'Contact',
    secEditorialTitle: 'Responsable des contenus éditoriaux selon le § 18 al. 2 MStV',
    secDisputeTitle: 'Règlement en ligne des litiges de l’UE',
    secDisputeText:
      'La Commission européenne met à disposition une plateforme de règlement en ligne des litiges (RLL) : https://ec.europa.eu/consumers/odr. Notre adresse e-mail figure ci-dessus. Nous ne sommes ni disposés ni tenus de participer à des procédures de conciliation des consommateurs.',
    secLiabilityTitle: 'Responsabilité pour les contenus et les liens',
    secLiabilityText:
      'En tant que prestataire, nous sommes responsables de nos propres contenus conformément au § 7 al. 1 TMG selon les lois générales. En vertu des §§ 8 à 10 TMG, nous ne sommes pas tenus de surveiller les informations externes transmises ou stockées, ni de rechercher des circonstances indiquant une activité illégale.'
  },
  ES: {
    backHome: 'Volver al inicio',
    badge: 'INFORMACIÓN LEGAL (§ 5 TMG)',
    title: 'AVISO LEGAL',
    subtitle: 'Información conforme al § 5 de la Ley alemana de Telemedios (TMG) y al § 18 del Tratado Estatal de Medios (MStV).',
    secCompanyTitle: 'Datos de la organización según el § 5 TMG',
    secContactTitle: 'Contacto',
    secEditorialTitle: 'Responsable del contenido editorial según el § 18 párr. 2 MStV',
    secDisputeTitle: 'Resolución de litigios en línea de la UE',
    secDisputeText:
      'La Comisión Europea proporciona una plataforma para la resolución de litigios en línea (RLL): https://ec.europa.eu/consumers/odr. Nuestro correo electrónico se encuentra arriba. No estamos dispuestos ni obligados a participar en procedimientos de resolución de conflictos ante una junta arbitral de consumo.',
    secLiabilityTitle: 'Responsabilidad por contenidos y enlaces',
    secLiabilityText:
      'Como proveedores de servicios, somos responsables de nuestros propios contenidos en estas páginas según la legislación general conforme al § 7 párr. 1 TMG. Según los §§ 8 a 10 TMG, no estamos obligados a supervisar la información transmitida o almacenada por terceros ni a investigar circunstancias ilegales.'
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
                <strong>FAZIX Esports Club</strong><br />
                European Rocket League Organization<br />
                Nordrhein-Westfalen (NRW)<br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secContactTitle}
              </h2>
              <p style={{ margin: 0 }}>
                E-Mail: <a href="mailto:management@fazix.gg" style={{ color: '#FF701E' }}>management@fazix.gg</a><br />
                Website: <a href="https://fazix-esport.xyz" style={{ color: '#FF701E' }}>https://fazix-esport.xyz</a><br />
                Community & Support: <a href="https://discord.gg/UdnGPHmvcT" target="_blank" rel="noopener noreferrer" style={{ color: '#FF701E' }}>discord.gg/UdnGPHmvcT</a>
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secEditorialTitle}
              </h2>
              <p style={{ margin: 0 }}>
                FAZIX Esports Management<br />
                NRW, Deutschland<br />
                E-Mail: <a href="mailto:management@fazix.gg" style={{ color: '#FF701E' }}>management@fazix.gg</a>
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
              <p style={{ margin: 0 }}>
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
