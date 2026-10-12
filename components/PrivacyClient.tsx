'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieSettingsButton } from '@/components/CookieSettingsButton';
import { useLanguage } from '@/context/LanguageContext';
import { type LanguageCode } from '@/lib/translations';
import { Shield, ArrowLeft, Lock, FileText, CheckCircle2, Mail } from 'lucide-react';

interface PrivacyContent {
  backHome: string;
  badge: string;
  title: string;
  subtitle: string;
  cookieHint: string;
  sec1Title: string;
  sec1Text: string;
  sec2Title: string;
  sec2Text: string;
  sec3Title: string;
  sec3Intro: string;
  sec3Items: string[];
  sec3Basis: string;
  sec4Title: string;
  sec4Text: string;
  sec4Basis: string;
  sec5Title: string;
  sec5Text: string;
  sec5Basis: string;
  sec6Title: string;
  sec6Text: string;
  sec7Title: string;
  sec7Fonts: string;
  sec7Social: string;
  sec7ThirdParty: string;
  sec8Title: string;
  sec8Text: string;
  sec9Title: string;
  sec9Intro: string;
  rights: {
    title: string;
    desc: string;
  }[];
  sec9Contact: string;
}

const PRIVACY_TRANSLATIONS: Record<LanguageCode, PrivacyContent> = {
  EN: {
    backHome: 'Back to Fazix Home',
    badge: 'GDPR / PRIVACY COMPLIANCE',
    title: 'PRIVACY POLICY',
    subtitle: 'Information about the processing of personal data on fazix-esport.xyz in accordance with Articles 13 and 14 of the European General Data Protection Regulation (EU GDPR).',
    cookieHint: 'You can review and modify your cookie settings at any time by clicking the following button:',
    sec1Title: '1. Name and Contact Details of the Controller',
    sec1Text: 'The controller responsible for data processing on this website within the meaning of the General Data Protection Regulation (GDPR) is:',
    sec2Title: '2. Principles of Data Processing (Privacy by Design & Default)',
    sec2Text: 'We process personal data strictly in accordance with GDPR and national data protection laws. Under the principles of data minimization and "Privacy by Design / Privacy by Default", we only collect personal data that is strictly required for the intended purpose (e.g. responding to inquiries, competitive scouting for team rosters, or technical website delivery).',
    sec3Title: '3. Website Delivery and Server Log Files',
    sec3Intro: 'When you access our website, information is automatically transmitted by your browser to our server and temporarily stored in a server log file:',
    sec3Items: [
      'IP address of the requesting device',
      'Date and timestamp of access',
      'Name and URL of the retrieved file/resource',
      'Website from which access originated (Referrer URL)',
      'Browser type, version, and operating system'
    ],
    sec3Basis: 'Legal basis: Art. 6(1)(f) GDPR. Our legitimate interest arises from ensuring a stable, smooth connection, system integrity, error diagnostics, and defense against malicious attacks.',
    sec4Title: '4. Contact Inquiries & Commercial Form',
    sec4Text: 'When contacting us via the management contact form, the details you submit (name, email address, organization, subject, message) are stored and processed to address your inquiry and follow-up communications.',
    sec4Basis: 'Legal basis: Processing is based on your explicit consent (Art. 6(1)(a) GDPR) via the active opt-in checkbox, as well as taking steps prior to entering into a contract (Art. 6(1)(b) GDPR). You may revoke your consent at any time with future effect via email.',
    sec5Title: '5. Player Scouting & Roster Applications',
    sec5Text: 'Through our application form, players and creators can apply for our competitive lineups (RLCS Main, Fazix Academy). The processed details include: In-Game Name (IGN), full name, age, country, Discord tag, Tracker Network profile link, competitive experience, and notes.',
    sec5Basis: 'Purpose & Legal basis: Art. 6(1)(b) GDPR (assessing and initiating a player agreement or team membership) and Art. 6(1)(a) GDPR (explicit applicant consent). Application data is deleted within 6 months following the conclusion of the trial cycle unless roster recruitment occurs.',
    sec6Title: '6. Cookies and Local Storage (Zero-Cookie Architecture)',
    sec6Text: 'Our website operates on a privacy-first, zero-persistent-cookie architecture. We do not set persistent tracking or marketing cookies. Technical preferences (such as your consent choices and chosen display language) are stored solely on your device using client-side localStorage (§ 25(2) No. 2 TDDDG). No personal data is transmitted to third parties without your explicit opt-in consent.',
    sec7Title: '7. Local Font Hosting, Third-Party Media & External Integrations',
    sec7Fonts: 'Typography: We do not load fonts dynamically from external Google servers. All font assets are hosted locally on our own web infrastructure. Your IP address is never transmitted to third-party overseas font servers.',
    sec7Social: 'Social Profiles: Links to our Twitch, YouTube, Discord, TikTok, and Instagram channels are strictly provided via standard hyperlinks. We do not embed external tracking pixels or invasive sharing scripts that send telemetry upon page load.',
    sec7ThirdParty: 'Third-Party Media & Embeds: For editorial news articles published via our Discord bot integration, images may be delivered via Discord CDN (Discord Inc., 444 De Haro St, San Francisco, CA 94107, USA). Additionally, on our Creators page, an interactive live video broadcast by Twitch (Twitch Interactive, Inc., 350 Bush St, San Francisco, CA 94104, USA) is embedded. Connecting to these media assets transmits technical connection metadata (including IP address) to the respective provider. Legal basis: Art. 6(1)(f) GDPR.',
    sec8Title: '8. SSL / TLS Security Encryption',
    sec8Text: 'This site uses industry-standard TLS encryption for security and to protect confidential transmissions, such as inquiries and competitive scouting submissions. You can recognize an encrypted connection by the "https://" prefix and the lock icon in your browser address bar.',
    sec9Title: '9. Your Rights as a Data Subject',
    sec9Intro: 'Under the GDPR, you have the following rights regarding your personal data:',
    rights: [
      { title: 'Right of Access (Art. 15 GDPR)', desc: 'You can request confirmation and details on the data we process concerning you.' },
      { title: 'Right to Rectification (Art. 16 GDPR)', desc: 'You can demand immediate correction of inaccurate or incomplete data.' },
      { title: 'Right to Erasure (Art. 17 GDPR)', desc: 'You have the right to request deletion of your personal data where grounds apply.' },
      { title: 'Right to Restriction (Art. 18 GDPR)', desc: 'You can request restriction of data processing under statutory conditions.' },
      { title: 'Right to Data Portability (Art. 20 GDPR)', desc: 'You can receive your data in a structured, machine-readable format.' },
      { title: 'Right to Object (Art. 21 GDPR)', desc: 'You have the right to object at any time to processing based on legitimate interests.' },
      { title: 'Right to Withdraw Consent (Art. 7(3) GDPR)', desc: 'You may revoke granted consent at any time with future effect.' },
      { title: 'Right to Lodge a Complaint (Art. 77 GDPR)', desc: 'You have the right to complain to a data protection supervisory authority (e.g. LDI NRW).' }
    ],
    sec9Contact: 'To exercise your rights, simply send an email to: fazixesports@gmail.com.'
  },
  DE: {
    backHome: 'Zurück zur Startseite',
    badge: 'DSGVO / GDPR KONFORMITÄT',
    title: 'DATENSCHUTZERKLÄRUNG',
    subtitle: 'Informationen über die Verarbeitung personenbezogener Daten auf der Website fazix-esport.xyz gemäß Art. 13 und 14 der europäischen Datenschutz-Grundverordnung (EU-DSGVO).',
    cookieHint: 'Sie können Ihre Cookie-Einstellungen jederzeit mit Klick auf den folgenden Button einsehen und ändern:',
    sec1Title: '1. Name und Kontaktdaten des Verantwortlichen',
    sec1Text: 'Verantwortlicher für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:',
    sec2Title: '2. Grundsätze der Datenverarbeitung (Privacy by Design & Default)',
    sec2Text: 'Wir verarbeiten personenbezogene Daten ausschließlich im Einklang mit den Bestimmungen der DSGVO und des Bundesdatenschutzgesetzes (BDSG). Gemäß dem Prinzip der Datenminimierung („Privacy by Design“ und „Privacy by Default“) erfassen wir nur Daten, die für den jeweiligen Zweck (z. B. Beantwortung von Anfragen, Scouting für Team-Roster, Bereitstellung der Website) zwingend erforderlich sind.',
    sec3Title: '3. Bereitstellung der Website und Erstellung von Logfiles',
    sec3Intro: 'Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in einem sogenannten Server-Logfile gespeichert:',
    sec3Items: [
      'IP-Adresse des anfragenden Rechners',
      'Datum und Uhrzeit des Zugriffs',
      'Name und URL der abgerufenen Datei',
      'Website, von der aus der Zugriff erfolgt (Referrer-URL)',
      'Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners'
    ],
    sec3Basis: 'Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse folgt aus den Zwecken zur Gewährleistung eines reibungslosen Verbindungsaufbaus der Website, der Systemsicherheit und Stabilität sowie der Missbrauchs- und Brute-Force-Abwehr.',
    sec4Title: '4. Datenverarbeitung bei Kontaktaufnahme (Kontaktformular)',
    sec4Text: 'Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten (Name, E-Mail-Adresse, Organisation, Betreff, Nachricht) zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.',
    sec4Basis: 'Rechtsgrundlage: Die Verarbeitung dieser Daten erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) über die aktive Opt-In-Checkbox im Formular sowie zur Durchführung vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO). Sie können diese Einwilligung jederzeit mit Wirkung für die Zukunft per E-Mail widerrufen.',
    sec5Title: '5. Bewerbungsverfahren (Join the Roster / Scouting)',
    sec5Text: 'Über unser Roster-Bewerbungsformular können sich Spieler und Creators für unsere Teams (RLCS Main, Fazix Academy) bewerben. Dabei werden folgende Angaben verarbeitet: Ingame-Name (IGN), vollständiger Name, Alter, Land, Discord-Tag, Tracker-Network URL, Wettbewerbserfahrung und Notizen.',
    sec5Basis: 'Zweck & Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Entscheidung über die Begründung einer Teamzugehörigkeit / Spielervertrags) sowie Art. 6 Abs. 1 lit. a DSGVO (ausdrückliche Einwilligung des Bewerbers). Nach Abschluss des Auswahlverfahrens werden Bewerbungsdaten nach spätestens 6 Monaten gelöscht, sofern keine Aufnahme in den Kader erfolgt.',
    sec6Title: '6. Cookies und Lokale Speicherung (Zero-Cookie-Architektur)',
    sec6Text: 'Unsere Website verfolgt eine strikte Zero-Cookie-Architektur. Wir setzen keine dauerhaften Tracking- oder Marketing-Cookies ein. Notwendige Benutzereinstellungen (wie Ihre gewählte Sprache und Ihr Einwilligungsstatus) werden ausschließlich lokal in Ihrem Browser (localStorage) gespeichert (§ 25 Abs. 2 Nr. 2 TDDDG). Eine unbefugte Weitergabe von Nutzerdaten an Dritte findet nicht statt.',
    sec7Title: '7. Lokale Schriftarten, Drittanbieter-Medien & Externe Einbindungen',
    sec7Fonts: 'Schriftarten: Wir binden keine dynamischen Schriftarten von externen Google-Servern ein. Alle Schriftarten werden lokal vom eigenen Server ausgeliefert. Es erfolgt zu keinem Zeitpunkt eine Übertragung Ihrer IP-Adresse an Google-Server im Ausland.',
    sec7Social: 'Social Media Links: Auf unserer Website verlinken wir zu unseren Profilen auf Twitch, YouTube, Discord, TikTok und Instagram vorrangig über reguläre Hyperlinks. Wir verwenden keine Social-Sharing-Plugins oder Tracking-Pixel (wie Facebook Pixel), die bereits beim Seitenaufruf ungefragt Tracking-Profile erstellen.',
    sec7ThirdParty: 'Drittanbieter-Medien & Einbettungen: Bei redaktionellen News-Beiträgen, die über unsere Discord-Bot-Schnittstelle bereitgestellt werden, können Bilddateien über das Content Delivery Network von Discord (Discord Inc., 444 De Haro St, San Francisco, CA 94107, USA) ausgeliefert werden. Zudem ist auf der Creators-Seite ein interaktiver Twitch-Livestream-Player (Twitch Interactive, Inc., 350 Bush St, San Francisco, CA 94104, USA) eingebunden. Beim Abruf dieser Medien werden technisch bedingt Verbindungsdaten (u. a. Ihre IP-Adresse und Browserdaten) an die Server des jeweiligen Anbieters übermittelt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an multimedialer Berichterstattung und Live-Esports-Inhalten).',
    sec8Title: '8. SSL- bzw. TLS-Verschlüsselung',
    sec8Text: 'Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Anfragen oder Roster-Bewerbungen, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.',
    sec9Title: '9. Ihre Rechte als betroffene Person',
    sec9Intro: 'Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:',
    rights: [
      { title: 'Recht auf Auskunft (Art. 15 DSGVO)', desc: 'Sie können Auskunft über Ihre von uns verarbeiteten Daten verlangen.' },
      { title: 'Recht auf Berichtigung (Art. 16 DSGVO)', desc: 'Sie können unverzüglich die Berichtigung unrichtiger Daten verlangen.' },
      { title: 'Recht auf Löschung (Art. 17 DSGVO)', desc: 'Sie können die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten verlangen.' },
      { title: 'Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)', desc: 'Sie können die Einschränkung der Datenverarbeitung verlangen.' },
      { title: 'Recht auf Datenübertragbarkeit (Art. 20 DSGVO)', desc: 'Sie können Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format erhalten.' },
      { title: 'Widerspruchsrecht (Art. 21 DSGVO)', desc: 'Sie können jederzeit gegen die Verarbeitung Widerspruch einlegen.' },
      { title: 'Widerrufsrecht (Art. 7 Abs. 3 DSGVO)', desc: 'Erteilte Einwilligungen können Sie jederzeit widerrufen.' },
      { title: 'Beschwerderecht (Art. 77 DSGVO)', desc: 'Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde (z. B. LDI NRW) zu beschweren.' }
    ],
    sec9Contact: 'Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung per E-Mail an: fazixesports@gmail.com.'
  },
  FR: {
    backHome: 'Retour à l’accueil',
    badge: 'CONFORMITÉ RGPD EUROPÉENNE',
    title: 'POLITIQUE DE CONFIDENTIALITÉ',
    subtitle: 'Informations concernant le traitement des données personnelles sur le site fazix-esport.xyz conformément aux articles 13 et 14 du RGPD.',
    cookieHint: 'Vous pouvez consulter et modifier vos préférences en matière de cookies à tout moment via le bouton ci-dessous :',
    sec1Title: '1. Nom et coordonnées du responsable du traitement',
    sec1Text: 'Le responsable du traitement des données sur ce site au sens du Règlement général sur la protection des données (RGPD) est :',
    sec2Title: '2. Principes de traitement (Privacy by Design & Default)',
    sec2Text: 'Nous traitons les données personnelles dans le respect strict du RGPD. Conformément au principe de minimisation (« Privacy by Design » et « Privacy by Default »), nous ne collectons que les données strictement indispensables aux finalités prévues (réponse aux demandes, recrutement compétitif, hébergement sécurisé).',
    sec3Title: '3. Fichiers journaux du serveur (Logs)',
    sec3Intro: 'Lors de l’accès à notre site web, votre navigateur transmet automatiquement des informations à notre serveur, temporairement enregistrées dans un fichier journal :',
    sec3Items: [
      'Adresse IP de l’appareil émetteur',
      'Date et heure de la requête',
      'Ressource ou URL consultée',
      'Site d’origine (URL de provenance)',
      'Navigateur et système d’exploitation'
    ],
    sec3Basis: 'Base juridique : Art. 6 al. 1 let. f RGPD. Notre intérêt légitime réside dans la sécurité, la stabilité du système et la prévention contre les attaques malveillantes.',
    sec4Title: '4. Formulaire de contact',
    sec4Text: 'Lorsque vous nous adressez une demande via notre formulaire, les informations saisies (nom, adresse e-mail, organisation, sujet, message) sont enregistrées pour traiter votre requête.',
    sec4Basis: 'Base juridique : Traitement fondé sur votre consentement explicite (Art. 6 al. 1 let. a RGPD) via la case à cocher, ainsi que sur l’exécution de mesures précontractuelles (Art. 6 al. 1 let. b RGPD).',
    sec5Title: '5. Recrutement esport & candidatures roster',
    sec5Text: 'Via notre formulaire de candidature, les joueurs et créateurs peuvent postuler pour nos équipes (RLCS Main, Fazix Academy). Données collectées : pseudo en jeu (IGN), nom, âge, pays, identifiant Discord, lien Tracker Network, expérience compétitive et notes.',
    sec5Basis: 'Finalité & base juridique : Art. 6 al. 1 let. b RGPD (évaluation pour l’intégration au roster / contrat joueur) et Art. 6 al. 1 let. a RGPD (consentement). Les données sont conservées un maximum de 6 mois après les tryouts.',
    sec6Title: '6. Cookies et stockage local (Architecture Zéro Cookie)',
    sec6Text: 'Notre site applique une architecture stricte sans cookies persistants de traçage ou de profilage. Les préférences techniques (comme la langue choisie et le statut de consentement) sont stockées exclusivement sur votre appareil via le stockage local (localStorage) (§ 25 al. 2 n° 2 TDDDG). Aucun transfert de données personnelles à des tiers n’a lieu sans consentement explicite.',
    sec7Title: '7. Polices hébergées localement & médias tiers intégrés',
    sec7Fonts: 'Typographie : Aucune police n’est téléchargée depuis les serveurs Google. Toutes les polices sont hébergées sur notre propre serveur. Aucune adresse IP n’est transmise à l’étranger.',
    sec7Social: 'Réseaux sociaux : Les liens vers nos chaînes Twitch, YouTube, Discord, TikTok et Instagram sont des hyperliens simples. Aucun pixel de pistage ou script intrusif n’est exécuté au chargement.',
    sec7ThirdParty: 'Médias tiers : Les articles publiés via Discord peuvent charger des images hébergées sur le CDN de Discord (Discord Inc., 444 De Haro St, San Francisco, CA 94107, USA). La page Creators intègre en outre un lecteur live Twitch (Twitch Interactive, Inc., USA). Lors du chargement, des données techniques de connexion sont transmises. Base juridique : Art. 6 al. 1 let. f RGPD.',
    sec8Title: '8. Chiffrement SSL / TLS',
    sec8Text: 'Ce site utilise un chiffrement SSL/TLS sécurisé pour protéger vos données confidentielles. Vous le visualisez par le cadenas et le protocole "https://" dans la barre d’adresse.',
    sec9Title: '9. Vos droits en tant que personne concernée',
    sec9Intro: 'Vous disposez des droits suivants concernant vos données à caractère personnel :',
    rights: [
      { title: 'Droit d’accès (Art. 15 RGPD)', desc: 'Obtenir la confirmation et le détail des données traitées vous concernant.' },
      { title: 'Droit de rectification (Art. 16 RGPD)', desc: 'Exiger la correction de données inexactes ou incomplètes.' },
      { title: 'Droit à l’effacement (Art. 17 RGPD)', desc: 'Demander la suppression de vos données personnelles.' },
      { title: 'Droit à la limitation (Art. 18 RGPD)', desc: 'Demander la suspension temporaire du traitement de vos données.' },
      { title: 'Droit à la portabilité (Art. 20 RGPD)', desc: 'Recevoir vos données dans un format structuré et lisible par machine.' },
      { title: 'Droit d’opposition (Art. 21 RGPD)', desc: 'Vous opposer à tout moment au traitement fondé sur un intérêt légitime.' },
      { title: 'Droit de retrait (Art. 7 al. 3 RGPD)', desc: 'Retirer à tout moment votre consentement pour l’avenir.' },
      { title: 'Droit de réclamation (Art. 77 RGPD)', desc: 'Introduire une réclamation auprès d’une autorité de contrôle (ex. CNIL ou LDI NRW).' }
    ],
    sec9Contact: 'Pour exercer vos droits, contactez-nous par e-mail à : fazixesports@gmail.com.'
  },
  ES: {
    backHome: 'Volver al inicio',
    badge: 'CUMPLIMIENTO RGPD EUROPEO',
    title: 'POLÍTICA DE PRIVACIDAD',
    subtitle: 'Información relativa al tratamiento de datos personales en fazix-esport.xyz conforme a los artículos 13 y 14 del RGPD europeo.',
    cookieHint: 'Puede consultar y modificar sus preferencias de cookies en cualquier momento pulsando el siguiente botón:',
    sec1Title: '1. Nombre y datos de contacto del responsable',
    sec1Text: 'El responsable del tratamiento de datos en este sitio web con arreglo al Reglamento General de Protección de Datos (RGPD) es:',
    sec2Title: '2. Principios del tratamiento (Privacidad desde el diseño y por defecto)',
    sec2Text: 'Tratamos los datos personales estrictamente según lo establecido por el RGPD. Conforme al principio de minimización de datos («Privacy by Design» y «Privacy by Default»), solo recabamos los datos estrictamente necesarios para cada fin legítimo.',
    sec3Title: '3. Archivos de registro del servidor (Logs)',
    sec3Intro: 'Al acceder a nuestra web, su navegador transmite automáticamente datos que se guardan temporalmente en los registros del servidor:',
    sec3Items: [
      'Dirección IP del dispositivo solicitante',
      'Fecha y hora del acceso',
      'Nombre y URL del archivo solicitado',
      'Sitio web de procedencia (URL de referencia)',
      'Navegador y sistema operativo empleado'
    ],
    sec3Basis: 'Base jurídica: Art. 6 párr. 1 letra f RGPD. Nuestro interés legítimo radica en garantizar la estabilidad técnica, seguridad del servidor y protección contra ataques.',
    sec4Title: '4. Formulario de contacto comercial',
    sec4Text: 'Al enviar una solicitud mediante el formulario, los datos facilitados (nombre, correo, organización, asunto, mensaje) se guardan para gestionar su consulta.',
    sec4Basis: 'Base jurídica: Tratamiento basado en su consentimiento expreso (Art. 6 párr. 1 letra a RGPD) mediante casilla de verificación activa, y en la aplicación de medidas precontractuales (Art. 6 párr. 1 letra b RGPD).',
    sec5Title: '5. Pruebas y reclutamiento de jugadores (Scouting)',
    sec5Text: 'Mediante el formulario de solicitud de roster, jugadores y creadores pueden postular a nuestros equipos (RLCS Main, Fazix Academy). Datos procesados: Nickname (IGN), nombre real, edad, país, usuario de Discord, enlace a Tracker Network, experiencia y notas.',
    sec5Basis: 'Finalidad y base jurídica: Art. 6 párr. 1 letra b RGPD (valoración para la incorporación al equipo) y Art. 6 párr. 1 letra a RGPD (consentimiento). Los datos se eliminan en un plazo máximo de 6 meses tras finalizar las pruebas.',
    sec6Title: '6. Cookies y almacenamiento local (Arquitectura Cero Cookies)',
    sec6Text: 'Nuestra web opera bajo una estricta política sin cookies de seguimiento o perfiles persistentes. Las preferencias técnicas (como el idioma seleccionado y el consentimiento) se guardan únicamente en el almacenamiento local de su navegador (localStorage) (§ 25 párr. 2 núm. 2 TDDDG). No se transfieren datos a terceros sin consentimiento previo.',
    sec7Title: '7. Fuentes locales, medios de terceros e integraciones externas',
    sec7Fonts: 'Tipografía: No conectamos con servidores externos de Google Fonts. Todas las fuentes se cargan desde nuestros servidores locales. Su IP no se envía a servidores de terceros.',
    sec7Social: 'Redes sociales: Los enlaces a Twitch, YouTube, Discord, TikTok e Instagram son hipervínculos convencionales. No incluimos píxeles de seguimiento ni complementos que transmitan datos al cargar la página.',
    sec7ThirdParty: 'Medios de terceros: Las noticias publicadas mediante Discord pueden incluir imágenes cargadas a través de la CDN de Discord (Discord Inc., 444 De Haro St, San Francisco, CA 94107, EE. UU.). Además, en la sección de Creators se incluye un reproductor en directo de Twitch (Twitch Interactive, Inc., EE. UU.). Al visualizar estos contenidos, se transmiten metadatos de conexión técnica. Base jurídica: Art. 6 párr. 1 letra f RGPD.',
    sec8Title: '8. Cifrado de seguridad SSL / TLS',
    sec8Text: 'Este sitio web utiliza cifrado SSL/TLS por motivos de seguridad y para proteger la transmisión de datos confidenciales. Puede verificarlo por el prefijo "https://" y el candado en su navegador.',
    sec9Title: '9. Sus derechos como persona afectada',
    sec9Intro: 'Usted ostenta los siguientes derechos respecto a sus datos personales:',
    rights: [
      { title: 'Derecho de acceso (Art. 15 RGPD)', desc: 'Obtener información sobre los datos personales que tratamos sobre usted.' },
      { title: 'Derecho de rectificación (Art. 16 RGPD)', desc: 'Exigir la corrección inmediata de datos inexactos o incompletos.' },
      { title: 'Derecho de supresión (Art. 17 RGPD)', desc: 'Solicitar el borrado de sus datos personales cuando proceda.' },
      { title: 'Derecho a la limitación (Art. 18 RGPD)', desc: 'Solicitar la limitación del tratamiento de sus datos.' },
      { title: 'Derecho a la portabilidad (Art. 20 RGPD)', desc: 'Recibir sus datos en un format estructurado y de lectura mecánica.' },
      { title: 'Derecho de oposición (Art. 21 RGPD)', desc: 'Oponerse al tratamiento fundamentado en intereses legítimos.' },
      { title: 'Derecho a revocar el consentimiento (Art. 7 párr. 3 RGPD)', desc: 'Revocar en cualquier momento el consentimiento otorgado.' },
      { title: 'Derecho de reclamación (Art. 77 RGPD)', desc: 'Presentar una reclamación ante una autoridad de control (p. ej. AEPD o LDI NRW).' }
    ],
    sec9Contact: 'Para ejercer cualquiera de sus derechos, envíe un correo electrónico a: fazixesports@gmail.com.'
  }
};

export function PrivacyClient() {
  const { language } = useLanguage();
  const t = PRIVACY_TRANSLATIONS[language] || PRIVACY_TRANSLATIONS.EN;

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
        <div className="container" style={{ maxWidth: '900px' }}>
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
          <div style={{ marginBottom: '44px' }}>
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
              <Shield size={14} /> {t.badge}
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

          {/* Content Card */}
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
              gap: '32px'
            }}
          >
            {/* 1. Verantwortlicher */}
            <section>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                {t.sec1Title}
              </h2>
              <p>{t.sec1Text}</p>
              <div
                style={{
                  backgroundColor: '#15151E',
                  padding: '16px 20px',
                  borderRadius: '8px',
                  border: '1px solid #282838',
                  marginTop: '10px'
                }}
              >
                <div style={{ fontWeight: 700, color: '#FFFFFF' }}>Jason Gabriel / FAZIX Esports</div>
                <div>Spillingsbreede 10</div>
                <div>32429 Minden, Deutschland</div>
                <div>
                  E-Mail: <a href="mailto:fazixesports@gmail.com" style={{ color: '#FF701E' }}>fazixesports@gmail.com</a>
                </div>
                <div>
                  Web: <a href="https://fazix-esport.xyz" style={{ color: '#FF701E' }}>https://fazix-esport.xyz</a>
                </div>
              </div>
            </section>

            {/* 2. Grundsätze */}
            <section>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                {t.sec2Title}
              </h2>
              <p>{t.sec2Text}</p>
            </section>

            {/* 3. Logfiles */}
            <section>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                {t.sec3Title}
              </h2>
              <p>{t.sec3Intro}</p>
              <ul style={{ paddingLeft: '22px', margin: '10px 0' }}>
                {t.sec3Items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p>
                <strong>{t.sec3Basis}</strong>
              </p>
            </section>

            {/* 4. Kontaktformular */}
            <section>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                {t.sec4Title}
              </h2>
              <p>{t.sec4Text}</p>
              <p>
                <strong>{t.sec4Basis}</strong>
              </p>
            </section>

            {/* 5. Scouting & Roster Bewerbung */}
            <section>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                {t.sec5Title}
              </h2>
              <p>{t.sec5Text}</p>
              <p>
                <strong>{t.sec5Basis}</strong>
              </p>
            </section>

            {/* 6. Cookies */}
            <section>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                {t.sec6Title}
              </h2>
              <p>{t.sec6Text}</p>
              <div style={{ marginTop: '14px' }}>
                <p>{t.cookieHint}</p>
                <CookieSettingsButton />
              </div>
            </section>

            {/* 7. Lokale Schriftarten & Social */}
            <section>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                {t.sec7Title}
              </h2>
              <p>
                <strong>{t.sec7Fonts}</strong>
              </p>
              <p>{t.sec7Social}</p>
              <p style={{ marginTop: '10px' }}>{t.sec7ThirdParty}</p>
            </section>

            {/* 8. SSL / TLS */}
            <section>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                {t.sec8Title}
              </h2>
              <p>{t.sec8Text}</p>
            </section>

            {/* 9. Betroffenenrechte */}
            <section>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
                {t.sec9Title}
              </h2>
              <p>{t.sec9Intro}</p>
              <ul style={{ paddingLeft: '22px', margin: '10px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {t.rights.map((r, idx) => (
                  <li key={idx}>
                    <strong>{r.title}:</strong> {r.desc}
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: '16px' }}>{t.sec9Contact}</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
