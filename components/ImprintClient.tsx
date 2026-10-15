'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { type LanguageCode } from '@/lib/translations';
import { ArrowLeft, Building } from 'lucide-react';

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
  secLiabilityContentTitle: string;
  secLiabilityContentText: string;
  secLiabilityLinksTitle: string;
  secLiabilityLinksText: string;
}

const IMPRINT_TRANSLATIONS: Record<LanguageCode, ImprintContent> = {
  EN: {
    backHome: 'Back to Fazix Home',
    badge: 'LEGAL DISCLOSURE (§ 5 DDG)',
    title: 'LEGAL NOTICE',
    subtitle: 'Information pursuant to § 5 of the German Digital Services Act (DDG) and § 18 of the State Media Treaty (MStV).',
    secCompanyTitle: 'Information pursuant to § 5 DDG',
    secContactTitle: 'Contact',
    secEditorialTitle: 'Responsible for journalistic and editorial content pursuant to § 18(2) MStV',
    secDisputeTitle: 'Consumer Dispute Resolution / Universal Arbitration Board (§ 36 VSBG)',
    secDisputeText:
      'We are neither willing nor obligated to participate in dispute resolution proceedings before a consumer arbitration board.',
    secLiabilityContentTitle: 'Liability for Content',
    secLiabilityContentText:
      'As a service provider, we are responsible for our own content on these pages under general statutory law in accordance with Section 7(1) of the German Digital Services Act (DDG) and the Digital Services Act (DSA, Regulation (EU) 2022/2065). Obligations to remove or block the use of information under general statutory law remain unaffected.',
    secLiabilityLinksTitle: 'Liability for External Links',
    secLiabilityLinksText:
      'This website contains links to external third-party websites over whose content we have no influence. We therefore cannot accept any liability for this external content. The respective provider or operator of the linked pages is always responsible for their content. If we become aware of any infringements, we will remove such links immediately.'
  },
  DE: {
    backHome: 'Zurück zur Startseite',
    badge: 'RECHTLICHE ANGABEN (§ 5 DDG)',
    title: 'IMPRESSUM',
    subtitle: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Medienstaatsvertrag (MStV).',
    secCompanyTitle: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)',
    secContactTitle: 'Kontakt',
    secEditorialTitle: 'Verantwortlich für journalistisch-redaktionelle Inhalte gemäß § 18 Abs. 2 MStV',
    secDisputeTitle: 'Verbraucherstreitbeilegung / Universalschlichtungsstelle (§ 36 VSBG)',
    secDisputeText:
      'Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    secLiabilityContentTitle: 'Haftung für Inhalte',
    secLiabilityContentText:
      'Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen und dem Digital Services Act (DSA, VO (EU) 2022/2065) verantwortlich. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.',
    secLiabilityLinksTitle: 'Haftung für externe Links',
    secLiabilityLinksText:
      'Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.'
  },
  FR: {
    backHome: 'Retour à l’accueil',
    badge: 'MENTIONS LÉGALES (§ 5 DDG)',
    title: 'MENTIONS LÉGALES',
    subtitle: 'Informations fournies conformément au § 5 de la loi allemande sur les services numériques (DDG) et au § 18 du traité d’État sur les médias (MStV).',
    secCompanyTitle: 'Informations selon le § 5 DDG',
    secContactTitle: 'Contact',
    secEditorialTitle: 'Responsable des contenus journalistiques et éditoriaux selon le § 18 al. 2 MStV',
    secDisputeTitle: 'Règlement des litiges de consommation (§ 36 VSBG)',
    secDisputeText:
      'Nous ne sommes ni disposés ni tenus de participer à des procédures de conciliation devant un organisme de règlement des litiges de consommation.',
    secLiabilityContentTitle: 'Responsabilité pour les contenus',
    secLiabilityContentText:
      'En tant que prestataire, nous sommes responsables de nos propres contenus conformément au § 7 al. 1 DDG selon les lois générales et le Digital Services Act (DSA, règlement (UE) 2022/2065). Les obligations de suppression ou de blocage de l’utilisation d’informations selon les lois générales restent inchangées.',
    secLiabilityLinksTitle: 'Responsabilité pour les liens externes',
    secLiabilityLinksText:
      'Notre site contient des liens vers des sites tiers sur lesquels nous n’avons aucune influence. Par conséquent, nous ne pouvons assumer aucune responsabilité pour ces contenus externes. Le fournisseur ou l’exploitant du site lié est toujours responsable de ses contenus. En cas de constatation d’infractions, nous retirerons immédiatement les liens concernés.'
  },
  ES: {
    backHome: 'Volver al inicio',
    badge: 'INFORMACIÓN LEGAL (§ 5 DDG)',
    title: 'AVISO LEGAL',
    subtitle: 'Información conforme al § 5 de la Ley alemana de Servicios Digitales (DDG) y al § 18 del Tratado Estatal de Medios (MStV).',
    secCompanyTitle: 'Datos de la organización según el § 5 DDG',
    secContactTitle: 'Contacto',
    secEditorialTitle: 'Responsable del contenido periodístico y editorial según el § 18 párr. 2 MStV',
    secDisputeTitle: 'Resolución de litigios de consumo (§ 36 VSBG)',
    secDisputeText:
      'No estamos dispuestos ni obligados a participar en procedimientos de resolución de conflictos ante una junta arbitral de consumo.',
    secLiabilityContentTitle: 'Responsabilidad por los contenidos',
    secLiabilityContentText:
      'Como proveedores de servicios, somos responsables de nuestros propios contenidos en estas páginas según la legislación general conforme al § 7 párr. 1 DDG y el Digital Services Act (DSA, Reglamento (UE) 2022/2065). Las obligaciones de supresión o bloqueo del uso de información según las leyes generales no se ven afectadas.',
    secLiabilityLinksTitle: 'Responsabilidad por enlaces externos',
    secLiabilityLinksText:
      'Este sitio web contiene enlaces a páginas web externas de terceros sobre cuyos contenidos no tenemos control. Por tanto, no podemos asumir responsabilidad por dichos contenidos ajenos. El respectivo proveedor u operador de las páginas enlazadas es siempre el responsable. En caso de detectarse infracciones, retiraremos tales enlaces de inmediato.'
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
            {/* Provider Information */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secCompanyTitle}
              </h2>
              <p style={{ margin: 0 }}>
                Jason Gabriel<br />
                Spillingsbreede 10<br />
                32429 Minden<br />
                Deutschland
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secContactTitle}
              </h2>
              <p style={{ margin: 0 }}>
                E-Mail:{' '}
                <a href="mailto:fazixesports@gmail.com" style={{ color: '#FF701E', textDecoration: 'none' }}>
                  fazixesports@gmail.com
                </a>
                <br />
                Website:{' '}
                <a
                  href="https://fazix-esport.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#FF701E', textDecoration: 'none' }}
                >
                  https://fazix-esport.xyz
                </a>
                <br />
                Community & Support:{' '}
                <a
                  href="https://discord.gg/UdnGPHmvcT"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#FF701E', textDecoration: 'none' }}
                >
                  https://discord.gg/UdnGPHmvcT
                </a>
              </p>
            </section>

            {/* Editorial responsibility */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secEditorialTitle}
              </h2>
              <p style={{ margin: 0 }}>
                Jason Gabriel<br />
                Spillingsbreede 10<br />
                32429 Minden<br />
                Deutschland
              </p>
            </section>

            {/* Dispute resolution */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secDisputeTitle}
              </h2>
              <p style={{ margin: 0 }}>
                {t.secDisputeText}
              </p>
            </section>

            {/* Liability for content */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secLiabilityContentTitle}
              </h2>
              <p style={{ margin: 0 }}>
                {t.secLiabilityContentText}
              </p>
            </section>

            {/* Liability for external links */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t.secLiabilityLinksTitle}
              </h2>
              <p style={{ margin: 0 }}>
                {t.secLiabilityLinksText}
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
