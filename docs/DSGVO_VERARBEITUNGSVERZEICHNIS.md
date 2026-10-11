# Verzeichnis von Verarbeitungstätigkeiten (VVT)
**gemäß Art. 30 EU-Datenschutz-Grundverordnung (DSGVO)**
*Erstellt für FAZIX Esports (Stand: Oktober 2026)*

---

## 1. Angaben zum Verantwortlichen (Art. 30 Abs. 1 lit. a DSGVO)

- **Name der Organisation:** FAZIX Esports Club (Rocket League European Operations)
- **Sitz:** Nordrhein-Westfalen (NRW), Deutschland
- **Vertretungsberechtigte:** FAZIX Management Board
- **E-Mail:** [management@fazix.gg](mailto:management@fazix.gg)
- **Website:** [https://fazix-esport.xyz](https://fazix-esport.xyz) (Markenauftritt: fazix.gg)
- **Datenschutz-Kontakt:** [privacy@fazix.gg](mailto:privacy@fazix.gg) bzw. [management@fazix.gg](mailto:management@fazix.gg)

---

## 2. Übersicht der Verarbeitungstätigkeiten (Art. 30 Abs. 1 lit. b–g DSGVO)

### VT 01: Bereitstellung der Website & Server-Logfiles
- **Zweck:** Bereitstellung des Webauftritts fazix-esport.xyz, Gewährleistung der Systemsicherheit, Missbrauchs- und DDoS-/Brute-Force-Abwehr.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse an Ausfallsicherheit und Stabilität).
- **Betroffene Personen:** Alle Website-Besucher.
- **Datenkategorien:** IP-Adresse, Datum und Uhrzeit des Abrufs, angeforderte URL/Ressource, HTTP-Statuscode, Referrer-URL, User-Agent (Browsertyp, Betriebssystem).
- **Empfänger:** Hosting-Provider (Auftragsverarbeiter nach Art. 28 DSGVO).
- **Löschfrist:** Automatische Rotation/Löschung nach maximal 14 Tagen, es sei denn, ein sicherheitsrelevanter Vorfall erfordert eine längere Beweissicherung.

---

### VT 02: Kontaktanfragen (Management & Partnerships)
- **Zweck:** Bearbeitung und Beantwortung von Anfragen zu Kooperationen, Sponsoring, Scrims und Medien.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung via Opt-In-Checkbox) & Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen).
- **Betroffene Personen:** Interessenten, Partner, Sponsoren, Medienvertreter.
- **Datenkategorien:** Name, E-Mail-Adresse, Organisation, Betreff, Nachrichteninhalt, Timestamp, IP-Adresse (zur Spam- und Rate-Limit-Prüfung).
- **Empfänger:** FAZIX Management und autorisierte Teamleiter.
- **Löschfrist:** Nach abschließender Bearbeitung der Anfrage, sofern keine gesetzlichen Aufbewahrungsfristen (z. B. HGB/AO bei geschäftlicher Korrespondenz: 6 bis 10 Jahre) entgegenstehen.

---

### VT 03: Roster-Bewerbungen & Scouting (RLCS Main, Academy, Creators)
- **Zweck:** Sichtung, Evaluierung und Auswahl von Talenten für kompetitive Rocket League Roster.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung/Teamaufnahme) & Art. 6 Abs. 1 lit. a DSGVO (ausdrückliche Einwilligung des Bewerbers).
- **Betroffene Personen:** Bewerber (Spieler, Coaches, Analysten, Content Creators).
- **Datenkategorien:** Ingame-Name (IGN), Vollständiger Name, Alter, Land, Discord-Tag, Tracker-Network URL, Wettbewerbserfahrung, Verfügbarkeit.
- **Empfänger:** Head Coach, Scouting Staff, Management.
- **Löschfrist:** Bei Nichtaufnahme in den Kader nach spätestens 6 Monaten; bei Aufnahme in die Kader- und Vertragsverwaltung überführt.

---

### VT 04: News-Ticker & Discord-Bot Schnittstelle
- **Zweck:** Synchronisation von Ankündigungen und Neuigkeiten zwischen internem Discord-Server und öffentlicher Website.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse an automatisierter redaktioneller Veröffentlichung).
- **Betroffene Personen:** Autoren/Staff (Discord-ID bei Bot-Aktionen).
- **Datenkategorien:** Redaktionelle Inhalte (Titel, Summary, Content), Autorentitel („Discord Bot“), Zeitstempel. Keine Speicherung personenbezogener Fan-Daten.
- **Empfänger:** Lokale Dateispeicherung (`data/news.json`), keine Weitergabe an Dritte.
- **Löschfrist:** Verbleibt im News-Archiv bis zur manuellen Archivierung/Löschung über den Bot (`/news delete`).

---

### VT 05: Cookie Consent Management
- **Zweck:** Einhaltung der gesetzlichen Einwilligungs- und Nachweispflicht nach § 25 TDDDG und Art. 7 Abs. 1 DSGVO.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung) & § 25 Abs. 2 TDDDG.
- **Betroffene Personen:** Website-Besucher.
- **Datenkategorien:** Einwilligungsstatus (Essenziell, Präferenzen, Analyse), Zeitstempel der Entscheidung. Gespeichert im lokalen Browser-Speicher (`localStorage`).
- **Empfänger:** Rein clientseitige Speicherung (kein Transfer an externe Tracking-Server).
- **Löschfrist:** Bis zum Löschen des Browser-Caches bzw. maximal 12 Monate.

---

## 3. Technische und organisatorische Maßnahmen (TOM nach Art. 32 DSGVO)

1. **Vertraulichkeit (Art. 32 Abs. 1 lit. b DSGVO):**
   - **Verschlüsselung:** End-to-End TLS 1.3 / HTTPS-Verschlüsselung mit HSTS für alle Website-Routen.
   - **Authentifizierung:** Timing-sichere Bearer-Token Authentifizierung (`timingSafeEqual`) für alle administrativen API-Schnittstellen.
   - **Zugriffsbeschränkung:** Keine öffentlichen Schreibrechte; Zugriff nur für autorisierte Bot- und Admin-Rollen.

2. **Integrität (Art. 32 Abs. 1 lit. b DSGVO):**
   - **Eingabevalidierung:** Strikte Schemaprüfung und Sanitisierung aller eingehenden Formular- und API-Payloads.
   - **Brute-Force & Rate-Limiting:** IP-basierte Ratenbegrenzung mit automatischem Lockout bei wiederholten Fehlschlägen (`lib/rateLimit.ts`).

3. **Verfügbarkeit & Belastbarkeit (Art. 32 Abs. 1 lit. b DSGVO):**
   - Automatische atomare Dateischreiboperationen zur Vermeidung von Race Conditions.
   - Server-Side Rendering (SSR) mit Fallback-Mechanismus im Memory-Store.

4. **Datenschutzfreundliche Voreinstellungen (Privacy by Default):**
   - Keine Einbindung externer Google Fonts über fremde Server (vollständig lokal gehostet).
   - Social Media Links als reine HTML-Links ohne Tracking-Pixel oder Third-Party-Skripte vor Interaktion.
   - Keine ungefragte Aktivierung von Analyse- oder Marketing-Cookies.
