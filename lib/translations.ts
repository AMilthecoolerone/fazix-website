export type LanguageCode = 'EN' | 'DE' | 'FR' | 'ES';

export interface SiteTranslations {
  nav: {
    items: {
      esports: string;
      creators: string;
      partners: string;
      community: string;
      company: string;
    };
    esportsDropdown: {
      rlcsTitle: string;
      rlcsSubtitle: string;
      academyTitle: string;
      academySubtitle: string;
      creatorsTitle: string;
      creatorsSubtitle: string;
      joinTitle: string;
      joinSubtitle: string;
    };
    creatorsDropdown: {
      allTitle: string;
      allSubtitle: string;
      r3ulexSubtitle?: string;
      kenorllSubtitle?: string;
      youtubeTitle: string;
      youtubeSubtitle: string;
      tiktokTitle?: string;
      tiktokSubtitle?: string;
      applyTitle: string;
      applySubtitle: string;
    };
    partnersDropdown: {
      beyondSubtitle: string;
      rocSubtitle: string;
      partnerWithTitle: string;
      partnerWithSubtitle: string;
    };
    communityDropdown: {
      discordTitle: string;
      discordSubtitle: string;
      twitchTitle: string;
      twitchSubtitle: string;
      youtubeTitle: string;
      youtubeSubtitle: string;
      tiktokTitle: string;
      tiktokSubtitle: string;
    };
    companyDropdown: {
      aboutTitle: string;
      aboutSubtitle: string;
      careersTitle: string;
      careersSubtitle: string;
      pressTitle: string;
      pressSubtitle: string;
      contactTitle: string;
      contactSubtitle: string;
    };
    applyBtn: string;
    languageLabel: string;
  };
  hero: {
    title: string;
    subtitle: string;
    applyBtn: string;
    discordBtn: string;
    scroll: string;
  };
  partners: {
    title: string;
  };
  news: {
    latest: string;
    news: string;
    subtitle: string;
    readMore: string;
    close: string;
    noNewsTitle: string;
    noNewsDesc: string;
  };
  roster: {
    tickerPro: string;
    tickerAcademy: string;
    tickerCommunity: string;
    tierAcademyTitle: string;
    tierAcademyDesc: string;
    tierMainTitle: string;
    tierMainDesc: string;
    tierCommunityTitle: string;
    tierCommunityDesc: string;
    exploreBtn: string;
    collapseBtn: string;
    divMain: string;
    divAcademy: string;
    divCommunityTab: string;
    communityCardTitle: string;
    communityCardDesc: string;
    joinTrialsBtn: string;
    peakMmr: string;
    winRate: string;
    mainCar: string;
    competitiveSetup: string;
    controller: string;
    camera: string;
    display: string;
    signatureMechanic: string;
    showStarting: string;
    seeMore: string;
  };
  about: {
    titlePart1: string;
    titlePart2: string;
    headingSubtitle: string;
    p1: string;
    p2: string;
    p3: string;
    applyButton: string;
  };
  footer: {
    brandDesc: string;
    colCompetition: string;
    colCommunity: string;
    colCompany: string;
    colGettingStarted: string;
    linkRlcs: string;
    linkAcademy: string;
    linkSchedule: string;
    linkApplyRoster: string;
    linkDiscord: string;
    linkTwitch: string;
    linkSixMans: string;
    linkWatchParties: string;
    linkCreators: string;
    linkAbout: string;
    linkStaff: string;
    linkNews: string;
    linkPressKit: string;
    linkApplyTeam: string;
    linkContactMgmt: string;
    privacy: string;
    imprint: string;
    cookieSettings: string;
    dsgvoRequests: string;
    copyright: string;
  };
  cookie: {
    title: string;
    desc: string;
    acceptAll: string;
    acceptEssential: string;
    customize: string;
    saveCustom: string;
    essentialTitle: string;
    essentialDesc: string;
    prefTitle: string;
    prefDesc: string;
    analyticsTitle: string;
    analyticsDesc: string;
  };
  apply: {
    backHome: string;
    title: string;
    subtitle: string;
    tierMainTitle: string;
    tierMainDesc: string;
    tierAcademyTitle: string;
    tierAcademyDesc: string;
    tierStaffTitle: string;
    tierStaffDesc: string;
    positionLabel: string;
    posMain: string;
    posAcademy: string;
    posCoach: string;
    posCreator: string;
    ignLabel: string;
    realNameLabel: string;
    ageLabel: string;
    countryLabel: string;
    emailLabel: string;
    discordLabel: string;
    roleLabel: string;
    rankLabel: string;
    trackerLabel: string;
    expLabel: string;
    notesLabel: string;
    msgLabel: string;
    consentText: string;
    consentError: string;
    submitBtn: string;
    submittingBtn: string;
    reviewNote: string;
    successTitle: string;
    successDesc: string;
    backBtn: string;
    submitAnother: string;
  };
  contact: {
    backHome: string;
    title: string;
    subtitle: string;
    directChannelsTitle: string;
    directEmailTitle: string;
    directEmailDesc: string;
    discordTitle: string;
    discordDesc: string;
    hqTitle: string;
    hqDesc: string;
    responseWindowTitle: string;
    responseWindowHours: string;
    trialsTitle: string;
    trialsDesc: string;
    trialsBtn: string;
    topicLabel: string;
    formTitle: string;
    nameLabel: string;
    emailLabel: string;
    orgLabel: string;
    subjectLabel: string;
    messageLabel: string;
    consentText: string;
    consentError: string;
    submitBtn: string;
    submittingBtn: string;
    rateLimitNotice: string;
    successTitle: string;
    successDesc: string;
    sendAnother: string;
    catPartnership: string;
    catTransfers: string;
    catTournaments: string;
    catPress: string;
    catGeneral: string;
  };
  creators: {
    backHome: string;
    badge: string;
    title: string;
    subtitle: string;
    watchR3ulexBtn: string;
    applyBtn: string;
    featuredBadge: string;
    watchStreamBtn: string;
    hidePlayer: string;
    showPlayer: string;
    tabAll: string;
    rosterTitle: string;
    rosterSubtitle: string;
    visitChannel: string;
    joinCardTitle: string;
    joinCardDesc: string;
    joinCardLi1: string;
    joinCardLi2: string;
    joinCardLi3: string;
    applyNowBtn: string;
    whyJoinTitle: string;
    whyJoinSubtitle: string;
    perk1Title: string;
    perk1Desc: string;
    perk2Title: string;
    perk2Desc: string;
    perk3Title: string;
    perk3Desc: string;
    perk4Title: string;
    perk4Desc: string;
    perksApplyBtn: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, SiteTranslations> = {
  EN: {
    nav: {
      items: {
        esports: 'Esports',
        creators: 'Creators',
        partners: 'Partners',
        community: 'Community',
        company: 'Company',
      },
      esportsDropdown: {
        rlcsTitle: 'Rocket League (RLCS)',
        rlcsSubtitle: 'European Championship Series main roster',
        academyTitle: 'Fazix Academy',
        academySubtitle: 'Academy 3v3 roster competing in regional qualifiers',
        creatorsTitle: 'Content Creators',
        creatorsSubtitle: 'Streamers & freestylers',
        joinTitle: 'Join the Roster',
        joinSubtitle: 'Trials for Supersonic Legend players',
      },
      creatorsDropdown: {
        allTitle: 'All Content Creators',
        allSubtitle: 'Full roster of streamers, freestylers & media',
        r3ulexSubtitle: 'Twitch streamer & Rocket League creator',
        kenorllSubtitle: 'Rocket League player & streamer',
        youtubeTitle: 'Fazix YouTube',
        youtubeSubtitle: 'Official match comms, recaps & VODs',
        tiktokTitle: 'Fazix TikTok',
        tiktokSubtitle: 'Short clips, highlights & mechanical plays',
        applyTitle: 'Apply as Creator',
        applySubtitle: 'Join the Fazix creator & streamer network',
      },
      partnersDropdown: {
        beyondSubtitle: 'Official Rocket League coaching partner',
        rocSubtitle: 'Competitive esports & tournament affiliate',
        partnerWithTitle: 'Partner With Fazix',
        partnerWithSubtitle: 'Sponsorship and partnership inquiries',
      },
      communityDropdown: {
        discordTitle: 'Official Discord',
        discordSubtitle: 'Community Discord with active RL members',
        twitchTitle: 'Twitch Channel',
        twitchSubtitle: 'Live tournament runs & pro streams',
        youtubeTitle: 'YouTube Channel',
        youtubeSubtitle: 'Match highlights, comms & scrims',
        tiktokTitle: 'TikTok & Clips',
        tiktokSubtitle: 'Short clips and mechanical highlights',
      },
      companyDropdown: {
        aboutTitle: 'About Fazix',
        aboutSubtitle: 'Our organisation & club vision',
        careersTitle: 'Careers & Staff',
        careersSubtitle: 'Coaching, media, and staff positions',
        pressTitle: 'Press & Media Kit',
        pressSubtitle: 'Official logos, assets & photos (ZIP)',
        contactTitle: 'Contact Management',
        contactSubtitle: 'Direct business and management inquiries',
      },
      applyBtn: 'Apply Now',
      languageLabel: 'Language',
    },
    hero: {
      title: 'FAZIX ESPORTS',
      subtitle: 'NRW-based Rocket League club competing in RLCS Europe. Starting rosters, match schedules, and open trials for SSL talent.',
      applyBtn: 'Apply Now',
      discordBtn: 'Join Our Discord',
      scroll: 'SCROLL',
    },
    partners: {
      title: 'PARTNERS & SPONSORS',
    },
    news: {
      latest: 'LATEST',
      news: 'NEWS',
      subtitle: 'Tournament results, match breakdowns, and roster announcements from the RLCS circuit.',
      readMore: 'Read Article',
      close: 'Close',
      noNewsTitle: 'NO ANNOUNCEMENTS YET',
      noNewsDesc: 'No articles published yet. Upcoming match results, official roster updates, and tournament announcements will appear here.',
    },
    roster: {
      tickerPro: 'PRO',
      tickerAcademy: 'ACADEMY',
      tickerCommunity: 'COMMUNITY',
      tierAcademyTitle: 'ACADEMY',
      tierAcademyDesc: 'In our Academy teams, talented players gain their first competitive experience at the highest regional level.',
      tierMainTitle: 'PRO',
      tierMainDesc: 'In our Pro teams, our players compete in top European leagues against the best of the best.',
      tierCommunityTitle: 'COMMUNITY',
      tierCommunityDesc: 'Our community also participates with amateur squads in open leagues, keeping fun and growth at the forefront.',
      exploreBtn: 'EXPLORE TEAMS',
      collapseBtn: 'COLLAPSE TEAMS',
      divMain: 'RLCS EUROPE (MAIN)',
      divAcademy: 'FAZIX ACADEMY',
      divCommunityTab: 'COMMUNITY & TRIALS',
      communityCardTitle: 'COMMUNITY & OPEN TRIALS',
      communityCardDesc: 'Our community rosters participate in weekly open cups, internal scrim leagues, and community tournaments. SSL players are invited to trial for Academy and Main lineups via Discord.',
      joinTrialsBtn: 'Join Discord Trials',
      peakMmr: 'PEAK MMR',
      winRate: 'WIN RATE',
      mainCar: 'MAIN CAR',
      competitiveSetup: 'COMPETITIVE SETUP',
      controller: 'Controller',
      camera: 'Camera Settings',
      display: 'Display',
      signatureMechanic: 'Signature Mechanic',
      showStarting: 'Show Starting 3',
      seeMore: 'See More',
    },
    about: {
      titlePart1: 'ABOUT',
      titlePart2: 'US',
      headingSubtitle: 'WHO WE ARE',
      p1: 'Fazix eSports focuses entirely on Rocket League, from developing talent starting at Platinum up to our high-SSL rosters. We are building a home where players at every rank find dedicated teams, improve together, and compete.',
      p2: 'Our rosters compete regularly in European leagues, open tournaments, Rival Rush, and RLCS qualifiers. Alongside team competition, we host our own community cups and open brackets for any squad looking for fair, competitive matches.',
      p3: 'Results on the pitch drive us forward, but our culture matters just as much. At Fazix, team chemistry, respect, and an active community free of toxicity carry the same weight as winning.',
      applyButton: 'Apply Now',
    },
    footer: {
      brandDesc: 'European Rocket League club competing in the RLCS. Based in NRW.',
      colCompetition: 'COMPETITION',
      colCommunity: 'COMMUNITY',
      colCompany: 'COMPANY',
      colGettingStarted: 'GETTING STARTED',
      linkRlcs: 'RLCS Europe',
      linkAcademy: 'Fazix Academy',
      linkSchedule: 'Tournament Schedule',
      linkApplyRoster: 'Apply for Roster →',
      linkDiscord: 'Discord (Community)',
      linkTwitch: 'Twitch Channel',
      linkSixMans: 'Weekly 6mans',
      linkWatchParties: 'Watch Parties',
      linkCreators: 'Content Creators',
      linkAbout: 'About Fazix',
      linkStaff: 'Team Staff',
      linkNews: 'News',
      linkPressKit: 'Press Kit',
      linkApplyTeam: 'Apply for Team',
      linkContactMgmt: 'Contact Management',
      privacy: 'Privacy Policy',
      imprint: 'Imprint',
      cookieSettings: 'Cookie Settings',
      dsgvoRequests: 'Data Subject Requests',
      copyright: '© 2026 Fazix Esports. All rights reserved.',
    },
    cookie: {
      title: 'Privacy & Cookie Settings',
      desc: 'We use cookies and privacy-first storage to deliver our website securely and in full GDPR compliance. You can adjust your preferences at any time in the footer.',
      acceptAll: 'Accept All',
      acceptEssential: 'Essential Only',
      customize: 'Customize',
      saveCustom: 'Save Preferences',
      essentialTitle: 'Essential Cookies & Storage',
      essentialDesc: 'Technically required for core navigation, security, and consent management.',
      prefTitle: 'Preferences',
      prefDesc: 'Remembers your selected language and interface preferences.',
      analyticsTitle: 'Analytics',
      analyticsDesc: 'Anonymous visitor statistics to optimize website performance.',
    },
    apply: {
      backHome: 'Back to Fazix Home',
      title: 'JOIN THE ROSTER',
      subtitle: 'We are scouting starting players for our RLCS European roster and developmental talent for Fazix Academy. Submit your competitive profile below.',
      tierMainTitle: 'RLCS Main Lineup',
      tierMainDesc: 'Supersonic Legend (1900+ MMR) with competitive tournament experience.',
      tierAcademyTitle: 'Fazix Academy',
      tierAcademyDesc: 'Grand Champion 3 to SSL players focused on team development.',
      tierStaffTitle: 'Coaching & Staff',
      tierStaffDesc: 'Replay analysts, team managers, and strategic coaches.',
      positionLabel: 'POSITION *',
      posMain: 'Semi Esports',
      posAcademy: 'Other Fazix Teams',
      posCoach: 'Coach / Analyst',
      posCreator: 'Creator',
      ignLabel: 'Rocket League In-Game Name (Epic / Steam)',
      realNameLabel: 'Full Name',
      ageLabel: 'AGE *',
      countryLabel: 'COUNTRY & SERVER REGION *',
      emailLabel: 'Email Address',
      discordLabel: 'Discord Tag (e.g. username)',
      roleLabel: 'Desired Role / Position',
      rankLabel: 'Current 3v3 Rank & Peak MMR',
      trackerLabel: 'Rocket League Tracker Network Link',
      expLabel: 'Competitive Experience & Previous Teams',
      notesLabel: 'AVAILABILITY & NOTES (OPTIONAL)',
      msgLabel: 'Why do you want to join Fazix?',
      consentText: 'I consent to the processing of my application data under the GDPR Privacy Policy.',
      consentError: 'Please consent to data processing according to our Privacy Policy.',
      submitBtn: 'Submit Application',
      submittingBtn: 'Submitting...',
      reviewNote: 'We review submissions weekly. Official RLCS tournament rules require all players to be at least 13 years old (parental consent required for players under 18).',
      successTitle: 'Application Submitted!',
      successDesc: 'Thank you for applying to Fazix. Our esports management will review your replay profile and contact you on Discord.',
      backBtn: 'Return to Home',
      submitAnother: 'Submit Another Application',
    },
    contact: {
      backHome: 'Back to Fazix Home',
      title: 'CONTACT MANAGEMENT',
      subtitle: 'Direct contact line for brand partnerships, commercial inquiries, tournament invitations, and esports management.',
      directChannelsTitle: 'Direct Channels',
      directEmailTitle: 'Direct Email',
      directEmailDesc: 'fazixesports@gmail.com',
      discordTitle: 'Discord Community',
      discordDesc: 'Open tickets in #support',
      hqTitle: 'Headquarters',
      hqDesc: 'North Rhine-Westphalia, Germany',
      responseWindowTitle: 'Response Window',
      responseWindowHours: 'Monday – Friday, 09:00 – 18:00 CET',
      trialsTitle: 'Player Trials',
      trialsDesc: 'Looking to trial for our RLCS or Fazix Academy roster? Use our dedicated player scouting form instead.',
      trialsBtn: 'Open Player Application →',
      topicLabel: 'INQUIRY TOPIC *',
      formTitle: 'Send a Message',
      nameLabel: 'Your Name',
      emailLabel: 'Email Address',
      orgLabel: 'ORGANIZATION / BRAND (OPTIONAL)',
      subjectLabel: 'Subject',
      messageLabel: 'Message',
      consentText: 'I consent to the processing of my contact inquiry according to the GDPR Privacy Policy.',
      consentError: 'Please consent to data processing according to our Privacy Policy.',
      submitBtn: 'Send Message',
      submittingBtn: 'Sending...',
      rateLimitNotice: 'Submissions are protected by rate limiting. Commercial inquiries are handled with strict NDA compliance.',
      successTitle: 'Message Received',
      successDesc: 'Thank you for reaching out. A management representative will reply to your inquiry shortly.',
      sendAnother: 'Send another message',
      catPartnership: 'Partnership & Sponsorship',
      catTransfers: 'Roster & Player Transfers',
      catTournaments: 'Tournament & Scrim Operations',
      catPress: 'Press & Media Inquiries',
      catGeneral: 'General Management',
    },
    creators: {
      backHome: 'Back to Overview',
      badge: 'Creator Roster',
      title: 'CONTENT CREATORS',
      subtitle: 'Streamers, freestylers, and content creators representing Fazix across Twitch, YouTube, and TikTok.',
      watchR3ulexBtn: 'Watch r3ulex on Twitch',
      applyBtn: 'Apply as Creator',
      featuredBadge: 'Featured Creator',
      watchStreamBtn: 'Watch Stream on Twitch',
      hidePlayer: 'Hide Stream Player',
      showPlayer: 'Live Stream Player',
      tabAll: 'All Platforms',
      rosterTitle: 'ALL CREATORS & MEDIA',
      rosterSubtitle: 'Explore active streams, YouTube series, and video channels',
      visitChannel: 'Visit Channel',
      joinCardTitle: 'Join the Creator Roster',
      joinCardDesc: 'Are you a Rocket League streamer, YouTube creator, or video editor? We provide hardware sponsorships, creative studio support, and cross-promotion to help you scale.',
      joinCardLi1: 'Twitch, YouTube, or TikTok channel',
      joinCardLi2: 'Consistent content schedule',
      joinCardLi3: 'Sponsorship perk opportunities',
      applyNowBtn: 'Apply Now',
      whyJoinTitle: 'WHY STREAM & CREATE FOR FAZIX?',
      whyJoinSubtitle: 'We empower gaming creators with elite gear, cross-platform amplification, and direct ties to our RLCS competitive teams.',
      perk1Title: 'Hardware & Sponsorships',
      perk1Desc: 'Access to peripheral partnerships, tournament setups, and gaming hardware from our official brand partners.',
      perk2Title: 'Creative Studio Support',
      perk2Desc: 'Custom stream overlays, YouTube thumbnails, sound alerts, and brand motion design produced by our in-house media team.',
      perk3Title: 'Community Amplification',
      perk3Desc: 'Broadcast your streams to thousands of followers across our Discord, Twitter/X, and official web portals.',
      perk4Title: 'Bootcamp & LAN Access',
      perk4Desc: 'Join the main and academy rosters at bootcamps, community tournaments, and European LAN events.',
      perksApplyBtn: 'Apply for Creator Program',
    },
  },
  DE: {
    nav: {
      items: {
        esports: 'Esports',
        creators: 'Creators',
        partners: 'Partner',
        community: 'Community',
        company: 'Organisation',
      },
      esportsDropdown: {
        rlcsTitle: 'Rocket League (RLCS)',
        rlcsSubtitle: 'European Championship Series Hauptkader',
        academyTitle: 'Fazix Academy',
        academySubtitle: 'Nachwuchs-3v3-Roster für regionale Qualifier',
        creatorsTitle: 'Content Creators',
        creatorsSubtitle: 'Streamer & Freestyler',
        joinTitle: 'Werde Teil des Teams',
        joinSubtitle: 'Tryouts für Supersonic Legend Spieler',
      },
      creatorsDropdown: {
        allTitle: 'Alle Content Creators',
        allSubtitle: 'Unser Roster aus Streamern, Freestylern & Medien',
        r3ulexSubtitle: 'Twitch-Streamer & Rocket League Creator',
        kenorllSubtitle: 'Rocket League Spieler & Streamer',
        youtubeTitle: 'Fazix YouTube',
        youtubeSubtitle: 'Offizielle Match-Comms, Recaps & VODs',
        tiktokTitle: 'Fazix TikTok',
        tiktokSubtitle: 'Kurzclips, Highlights & mechanische Spielzüge',
        applyTitle: 'Als Creator bewerben',
        applySubtitle: 'Werde Teil des Fazix Streaming-Netzwerks',
      },
      partnersDropdown: {
        beyondSubtitle: 'Offizieller Rocket League Coaching-Partner',
        rocSubtitle: 'Turnierpartner & Esports-Affiliate',
        partnerWithTitle: 'Partner von Fazix werden',
        partnerWithSubtitle: 'Sponsoring- und Kooperationsanfragen',
      },
      communityDropdown: {
        discordTitle: 'Offizieller Discord',
        discordSubtitle: 'Aktive Community mit regelmäßigen Events',
        twitchTitle: 'Twitch-Kanal',
        twitchSubtitle: 'Live-Turniere & Pro-Streams',
        youtubeTitle: 'YouTube-Kanal',
        youtubeSubtitle: 'Highlights, Match-Comms & Scrims',
        tiktokTitle: 'TikTok & Clips',
        tiktokSubtitle: 'Kurzclips und mechanische Highlights',
      },
      companyDropdown: {
        aboutTitle: 'Über Fazix',
        aboutSubtitle: 'Unsere Organisation & Vereinsvision',
        careersTitle: 'Karriere & Staff',
        careersSubtitle: 'Coaching, Medien und Organisation',
        pressTitle: 'Presse- & Medienkit',
        pressSubtitle: 'Offizielle Logos, Grafiken & Fotos (ZIP)',
        contactTitle: 'Management kontaktieren',
        contactSubtitle: 'Direkte geschäftliche Anfragen',
      },
      applyBtn: 'Jetzt Bewerben',
      languageLabel: 'Sprache',
    },
    hero: {
      title: 'FAZIX ESPORTS',
      subtitle: 'Rocket-League-Organisation aus NRW im Wettbewerb der RLCS Europe. Feste Roster, Turniere und offene Tryouts für SSL-Spieler.',
      applyBtn: 'Jetzt Bewerben',
      discordBtn: 'Unserem Discord beitreten',
      scroll: 'SCROLLEN',
    },
    partners: {
      title: 'PARTNER & SPONSOREN',
    },
    news: {
      latest: 'AKTUELLE',
      news: 'NEWS',
      subtitle: 'Turnierergebnisse, Match-Analysen und Roster-Neuigkeiten aus dem RLCS-Zirkel.',
      readMore: 'Artikel lesen',
      close: 'Schließen',
      noNewsTitle: 'AKTUELL KEINE NEUIGKEITEN',
      noNewsDesc: 'Noch keine Beiträge veröffentlicht. Kommende Match-Ergebnisse, Roster-Updates und Turnierberichte erscheinen in Kürze hier.',
    },
    roster: {
      tickerPro: 'PRO',
      tickerAcademy: 'ACADEMY',
      tickerCommunity: 'COMMUNITY',
      tierAcademyTitle: 'ACADEMY',
      tierAcademyDesc: 'In unseren Academy-Teams sammeln talentierte Spieler erste kompetitive Erfahrungen auf höchstem regionalen Niveau.',
      tierMainTitle: 'PRO',
      tierMainDesc: 'In unseren Pro-Teams messen sich unsere Spieler in europäischen Spitzenligen mit den Besten der Besten.',
      tierCommunityTitle: 'COMMUNITY',
      tierCommunityDesc: 'Auch unsere Community nimmt mit Amateur-Teams an offenen Ligen teil, wobei Spaß und Weiterentwicklung im Mittelpunkt stehen.',
      exploreBtn: 'TEAMS ANSEHEN',
      collapseBtn: 'TEAMS EINKLAPPEN',
      divMain: 'RLCS EUROPE (MAIN)',
      divAcademy: 'FAZIX ACADEMY',
      divCommunityTab: 'COMMUNITY & TRYOUTS',
      communityCardTitle: 'COMMUNITY & OFFENE TRYOUTS',
      communityCardDesc: 'Unsere Community-Teams spielen in wöchentlichen Cups, internen Scrims und offenen Turnieren. SSL-Spieler können sich über Discord für Academy und Main beweisen.',
      joinTrialsBtn: 'Discord-Tryouts beitreten',
      peakMmr: 'PEAK MMR',
      winRate: 'WIN RATE',
      mainCar: 'HAUPTAUTO',
      competitiveSetup: 'SETUP & HARDWARE',
      controller: 'Controller',
      camera: 'Kameraeinstellungen',
      display: 'Monitor',
      signatureMechanic: 'Spezial-Mechanik',
      showStarting: 'Startaufstellung zeigen',
      seeMore: 'Mehr anzeigen',
    },
    about: {
      titlePart1: 'ÜBER',
      titlePart2: 'UNS',
      headingSubtitle: 'WER WIR SIND',
      p1: 'Fazix eSports konzentriert sich voll auf Rocket League, vom Nachwuchs ab Platin bis zum High-SSL-Kader. Wir bauen eine Organisation auf, in der Spieler auf jedem Rang feste Teams finden, sich weiterentwickeln und gemeinsam antreten.',
      p2: 'Unsere Teams spielen regelmäßig in europäischen Ligen, Turnieren wie Rival Rush und den RLCS-Qualifiern. Neben dem Ligabetrieb veranstalten wir eigene Community-Cups und offene Turniere für alle Teams, die sich in fairen Brackets messen wollen.',
      p3: 'Sportlicher Erfolg treibt uns an, aber die Vereinskultur wiegt genauso schwer. Bei Fazix zählen Teamgeist, Respekt und eine aktive Community ohne toxisches Verhalten genauso wie der Sieg auf der Anzeigetafel.',
      applyButton: 'Jetzt Bewerben',
    },
    footer: {
      brandDesc: 'Europäischer Rocket-League-Club im RLCS-Wettbewerb. Aus Nordrhein-Westfalen.',
      colCompetition: 'WETTBEWERB',
      colCommunity: 'COMMUNITY',
      colCompany: 'ORGANISATION',
      colGettingStarted: 'EINSTIEG',
      linkRlcs: 'RLCS Europe',
      linkAcademy: 'Fazix Academy',
      linkSchedule: 'Turnierplan',
      linkApplyRoster: 'Für Roster bewerben →',
      linkDiscord: 'Discord (Community)',
      linkTwitch: 'Twitch-Kanal',
      linkSixMans: 'Wöchentliche 6mans',
      linkWatchParties: 'Watch Parties',
      linkCreators: 'Content Creators',
      linkAbout: 'Über Fazix',
      linkStaff: 'Staff & Teamleitung',
      linkNews: 'News',
      linkPressKit: 'Pressemappe',
      linkApplyTeam: 'Fürs Team bewerben',
      linkContactMgmt: 'Management kontaktieren',
      privacy: 'Datenschutz',
      imprint: 'Impressum',
      cookieSettings: 'Cookie-Einstellungen',
      dsgvoRequests: 'Betroffenenanfragen',
      copyright: '© 2026 Fazix Esports. Alle Rechte vorbehalten.',
    },
    cookie: {
      title: 'Privatsphäre & Cookie-Einstellungen',
      desc: 'Wir nutzen Cookies und lokale Speicherfunktionen, um unsere Website sicher und DSGVO-konform bereitzustellen. Ihre Auswahl können Sie jederzeit im Footer ändern.',
      acceptAll: 'Alle akzeptieren',
      acceptEssential: 'Nur essenzielle',
      customize: 'Anpassen',
      saveCustom: 'Auswahl speichern',
      essentialTitle: 'Essenzielle Technologien',
      essentialDesc: 'Technisch zwingend erforderlich für Seitennavigation, Sicherheit und Einwilligungsverwaltung.',
      prefTitle: 'Präferenzen',
      prefDesc: 'Speichert Ihre gewählte Sprache und Ansichtseinstellungen dauerhaft.',
      analyticsTitle: 'Statistik & Analyse',
      analyticsDesc: 'Anonymisierte Reichweitenmessung zur Optimierung der Seitenleistung.',
    },
    apply: {
      backHome: 'Zurück zur Startseite',
      title: 'WERDE TEIL DES TEAMS',
      subtitle: 'Wir suchen Starter für unser RLCS Europe Roster sowie Nachwuchsspieler für Fazix Academy. Reiche hier dein Profil ein.',
      tierMainTitle: 'RLCS Hauptkader',
      tierMainDesc: 'Supersonic Legend (1900+ MMR) mit Turnier- und Ligaerfahrung.',
      tierAcademyTitle: 'Fazix Academy',
      tierAcademyDesc: 'Grand Champion 3 bis SSL mit Fokus auf Teamentwicklung.',
      tierStaffTitle: 'Coaching & Management',
      tierStaffDesc: 'Replay-Analysten, Teammanager und taktische Coaches.',
      positionLabel: 'POSITION *',
      posMain: 'Semi Esports',
      posAcademy: 'Weitere Fazix Teams',
      posCoach: 'Coach / Analyst',
      posCreator: 'Creator',
      ignLabel: 'Rocket League Name im Spiel (Epic / Steam)',
      realNameLabel: 'Vollständiger Name',
      ageLabel: 'ALTER *',
      countryLabel: 'LAND & SERVER-REGION *',
      emailLabel: 'E-Mail-Adresse',
      discordLabel: 'Discord-Tag (z.B. benutzername)',
      roleLabel: 'Gewünschte Position / Rolle',
      rankLabel: 'Aktueller 3v3 Rang & Peak-MMR',
      trackerLabel: 'Rocket League Tracker Link',
      expLabel: 'Turniererfahrung & bisherige Teams',
      notesLabel: 'VERFÜGBARKEIT & ANMERKUNGEN (OPTIONAL)',
      msgLabel: 'Warum möchtest du zu Fazix?',
      consentText: 'Ich willige in die Verarbeitung meiner Daten gemäß der Datenschutzerklärung ein.',
      consentError: 'Bitte willigen Sie in die Datenverarbeitung gemäß unserer Datenschutzerklärung ein.',
      submitBtn: 'Bewerbung absenden',
      submittingBtn: 'Wird gesendet...',
      reviewNote: 'Wir prüfen Bewerbungen wöchentlich. Die offiziellen RLCS-Turnierregeln setzen ein Mindestalter von 13 Jahren voraus (bei Spielern unter 18 Jahren ist das Einverständnis der Erziehungsberechtigten erforderlich).',
      successTitle: 'Bewerbung eingereicht!',
      successDesc: 'Vielen Dank für deine Bewerbung. Unser Team prüft deine Daten und kontaktiert dich per Discord.',
      backBtn: 'Zurück zur Startseite',
      submitAnother: 'Weitere Bewerbung einreichen',
    },
    contact: {
      backHome: 'Zurück zur Startseite',
      title: 'MANAGEMENT KONTAKTIEREN',
      subtitle: 'Direkter Kontakt für Markenpartnerschaften, Kooperationen, Turniereinladungen und Teammanagement.',
      directChannelsTitle: 'Direkte Kanäle',
      directEmailTitle: 'Direkte E-Mail',
      directEmailDesc: 'fazixesports@gmail.com',
      discordTitle: 'Discord Community',
      discordDesc: 'Tickets in #support',
      hqTitle: 'Standort',
      hqDesc: 'Nordrhein-Westfalen, Deutschland',
      responseWindowTitle: 'Antwortzeiten',
      responseWindowHours: 'Montag – Freitag, 09:00 – 18:00 Uhr MEZ',
      trialsTitle: 'Tryouts für Spieler',
      trialsDesc: 'Möchtest du dich für unser RLCS- oder Fazix Academy-Team bewerben? Nutze bitte unser Spieler-Formular.',
      trialsBtn: 'Spieler-Bewerbung öffnen →',
      topicLabel: 'THEMA DER ANFRAGE *',
      formTitle: 'Nachricht senden',
      nameLabel: 'Ihr Name',
      emailLabel: 'E-Mail-Adresse',
      orgLabel: 'ORGANISATION / MARKE (OPTIONAL)',
      subjectLabel: 'Betreff',
      messageLabel: 'Nachricht',
      consentText: 'Ich stimme der Kontaktaufnahme und Datenverarbeitung gemäß Datenschutzerklärung zu.',
      consentError: 'Bitte willigen Sie in die Datenverarbeitung gemäß unserer Datenschutzerklärung ein.',
      submitBtn: 'Nachricht senden',
      submittingBtn: 'Wird gesendet...',
      rateLimitNotice: 'Übermittlungen sind geschützt. Geschäftliche Anfragen unterliegen strenger Vertraulichkeit.',
      successTitle: 'Nachricht erhalten',
      successDesc: 'Vielen Dank für deine Nachricht. Unser Management meldet sich zeitnah bei dir.',
      sendAnother: 'Weitere Nachricht senden',
      catPartnership: 'Partnerschaften & Sponsoring',
      catTransfers: 'Roster & Spielertransfers',
      catTournaments: 'Turniere & Scrims',
      catPress: 'Presse & Medien',
      catGeneral: 'Management & Allgemeines',
    },
    creators: {
      backHome: 'Zurück zur Übersicht',
      badge: 'Creator Roster',
      title: 'CONTENT CREATORS',
      subtitle: 'Streamer, Freestyler und Content Creators, die Fazix auf Twitch, YouTube und TikTok vertreten.',
      watchR3ulexBtn: 'r3ulex auf Twitch ansehen',
      applyBtn: 'Als Creator bewerben',
      featuredBadge: 'Featured Creator',
      watchStreamBtn: 'Stream auf Twitch ansehen',
      hidePlayer: 'Player ausblenden',
      showPlayer: 'Live-Stream Player',
      tabAll: 'Alle Plattformen',
      rosterTitle: 'ALLE CREATORS & MEDIEN',
      rosterSubtitle: 'Entdecke aktive Livestreams, YouTube-Formate und Highlight-Videos',
      visitChannel: 'Kanal besuchen',
      joinCardTitle: 'Werde Teil des Creator-Teams',
      joinCardDesc: 'Bist du Rocket League Streamer, YouTube Creator oder Video Editor? Wir unterstützen dich mit Hardware-Sponsorings, Studio-Grafiken und Reichweite.',
      joinCardLi1: 'Twitch, YouTube oder TikTok Kanal',
      joinCardLi2: 'Regelmäßiger Streaming- & Upload-Plan',
      joinCardLi3: 'Exklusive Sponsoring-Vorteile',
      applyNowBtn: 'Jetzt bewerben',
      whyJoinTitle: 'WARUM BEI FAZIX STREAMEN & CONTENT ERSTELLEN?',
      whyJoinSubtitle: 'Wir statten Creators mit erstklassigem Equipment aus, vergrößern deine Reichweite und binden dich in unsere RLCS-Organisation ein.',
      perk1Title: 'Hardware & Sponsorings',
      perk1Desc: 'Zugang zu Partnerschaften für Gaming-Peripherie, Turnier-Hardware und offiziellen Brands.',
      perk2Title: 'Creative Studio Support',
      perk2Desc: 'Individuelle Stream-Overlays, YouTube-Thumbnails, Sound-Alerts und Motion Design aus unserem internen Medienteam.',
      perk3Title: 'Community-Reichweite',
      perk3Desc: 'Verbreite deine Streams über unseren Discord, X/Twitter und unsere offiziellen Webkanäle.',
      perk4Title: 'Bootcamp & LAN-Events',
      perk4Desc: 'Begleite unsere Teams zu Bootcamps, Community-Cups und europäischen LAN-Turnieren.',
      perksApplyBtn: 'Für das Creator-Programm bewerben',
    },
  },
  FR: {
    nav: {
      items: {
        esports: 'Esport',
        creators: 'Créateurs',
        partners: 'Partenaires',
        community: 'Communauté',
        company: 'Structure',
      },
      esportsDropdown: {
        rlcsTitle: 'Rocket League (RLCS)',
        rlcsSubtitle: 'Équipe principale pour le circuit européen',
        academyTitle: 'Fazix Académie',
        academySubtitle: 'Équipe académie 3v3 en tournois régionaux',
        creatorsTitle: 'Créateurs de contenu',
        creatorsSubtitle: 'Streamers & freestylers',
        joinTitle: 'Rejoindre le roster',
        joinSubtitle: 'Recrutement pour joueurs Supersonic Legend',
      },
      creatorsDropdown: {
        allTitle: 'Tous les créateurs',
        allSubtitle: 'Notre collectif de streamers et créateurs',
        r3ulexSubtitle: 'Streamer Twitch & créateur Rocket League',
        kenorllSubtitle: 'Joueur Rocket League & streamer',
        youtubeTitle: 'YouTube Fazix',
        youtubeSubtitle: 'Comms de match, résumés et rediffusions',
        tiktokTitle: 'Fazix TikTok',
        tiktokSubtitle: 'Clips courts, temps forts & actions de jeu',
        applyTitle: 'Postuler comme créateur',
        applySubtitle: 'Rejoindre le réseau de streaming Fazix',
      },
      partnersDropdown: {
        beyondSubtitle: 'Partenaire officiel de coaching Rocket League',
        rocSubtitle: 'Affilié compétitif et organisateur de tournois',
        partnerWithTitle: 'Devenir partenaire',
        partnerWithSubtitle: 'Demandes de sponsoring et partenariats',
      },
      communityDropdown: {
        discordTitle: 'Discord officiel',
        discordSubtitle: 'Communauté active et tournois ouverts',
        twitchTitle: 'Chaîne Twitch',
        twitchSubtitle: 'Tournois en direct & streams pros',
        youtubeTitle: 'Chaîne YouTube',
        youtubeSubtitle: 'Temps forts, comms et scrims',
        tiktokTitle: 'TikTok & Clips',
        tiktokSubtitle: 'Clips et mécaniques de haut niveau',
      },
      companyDropdown: {
        aboutTitle: 'À propos de Fazix',
        aboutSubtitle: 'Notre organisation et nos ambitions',
        careersTitle: 'Recrutement & Staff',
        careersSubtitle: 'Postes de coachs, médias et gestion',
        pressTitle: 'Kit Presse & Médias',
        pressSubtitle: 'Logos officiels, visuels et photos (ZIP)',
        contactTitle: 'Contacter le management',
        contactSubtitle: 'Relations commerciales et professionnelles',
      },
      applyBtn: 'Postuler',
      languageLabel: 'Langue',
    },
    hero: {
      title: 'FAZIX ESPORTS',
      subtitle: 'Club Rocket League basé en Allemagne participant aux RLCS Europe. Équipes titulaires, calendrier et recrutements SSL ouverts.',
      applyBtn: 'Postuler',
      discordBtn: 'Rejoindre notre Discord',
      scroll: 'DÉFILER',
    },
    partners: {
      title: 'PARTENAIRES & SPONSORS',
    },
    news: {
      latest: 'DERNIÈRES',
      news: 'ACTUALITÉS',
      subtitle: 'Résultats de tournois, analyses de matchs et annonces d\'équipe du circuit RLCS.',
      readMore: 'Lire l\'article',
      close: 'Fermer',
      noNewsTitle: 'AUCUNE ACTUALITÉ POUR LE MOMENT',
      noNewsDesc: 'Aucun article publié pour le moment. Les résultats des matchs, les annonces de roster et les tournois seront publiés ici.',
    },
    roster: {
      tickerPro: 'PRO',
      tickerAcademy: 'ACADEMY',
      tickerCommunity: 'COMMUNITY',
      tierAcademyTitle: 'ACADEMY',
      tierAcademyDesc: 'Dans nos équipes Academy, les joueurs talentueux acquièrent leur première expérience compétitive au plus haut niveau régional.',
      tierMainTitle: 'PRO',
      tierMainDesc: 'Dans nos équipes Pro, nos joueurs s’affrontent dans les meilleures ligues européennes contre l’élite.',
      tierCommunityTitle: 'COMMUNITY',
      tierCommunityDesc: 'Notre communauté participe également avec des équipes amateurs à des ligues ouvertes, en mettant l’accent sur le plaisir et la progression.',
      exploreBtn: 'DÉCOUVRIR LES ÉQUIPES',
      collapseBtn: 'RÉDUIRE LES ÉQUIPES',
      divMain: 'RLCS EUROPE (PRINCIPAL)',
      divAcademy: 'FAZIX ACADÉMIE',
      divCommunityTab: 'COMMUNAUTÉ & TESTS',
      communityCardTitle: 'COMMUNAUTÉ & TESTS OUVERTS',
      communityCardDesc: 'Nos formations communautaires disputent des coupes hebdomadaires et des tournois ouverts. Les joueurs SSL peuvent postuler pour les équipes académie et principale via Discord.',
      joinTrialsBtn: 'Rejoindre les tests Discord',
      peakMmr: 'MMR MAX',
      winRate: 'RATIO VICTOIRES',
      mainCar: 'VÉHICULE PRINCIPAL',
      competitiveSetup: 'CONFIGURATION MATÉRIELLE',
      controller: 'Manette',
      camera: 'Paramètres caméra',
      display: 'Écran',
      signatureMechanic: 'Mécanique signature',
      showStarting: 'Afficher les titulaires',
      seeMore: 'Voir plus',
    },
    about: {
      titlePart1: 'À PROPOS',
      titlePart2: 'DE NOUS',
      headingSubtitle: 'QUI NOUS SOMMES',
      p1: "Fazix eSports est une organisation dédiée à Rocket League, des talents émergents dès le rang Platine jusqu'à nos effectifs de haut niveau SSL. Nous construisons une structure où les joueurs de tout niveau trouvent une équipe stable, progressent et participent à la compétition.",
      p2: "Nos équipes disputent régulièrement les ligues européennes, les tournois ouverts, Rival Rush et les qualifications RLCS. En parallèle, nous organisons nos propres coupes communautaires et des tournois ouverts à toutes les équipes souhaitant s'affronter dans des brackets équitables.",
      p3: "La performance sur le terrain nous motive, mais notre esprit d'équipe compte tout autant. Chez Fazix, l'entraide, le respect et une communauté soudée sans toxicité ont autant de valeur que la victoire.",
      applyButton: 'Postuler',
    },
    footer: {
      brandDesc: 'Club européen d\'esport Rocket League engagé en RLCS.',
      colCompetition: 'COMPÉTITION',
      colCommunity: 'COMMUNAUTÉ',
      colCompany: 'ORGANISATION',
      colGettingStarted: 'COMMENCER',
      linkRlcs: 'RLCS Europe',
      linkAcademy: 'Fazix Académie',
      linkSchedule: 'Calendrier des tournois',
      linkApplyRoster: 'Rejoindre l\'équipe →',
      linkDiscord: 'Discord communautaire',
      linkTwitch: 'Chaîne Twitch',
      linkSixMans: '6mans hebdomadaires',
      linkWatchParties: 'Watch Parties',
      linkCreators: 'Créateurs de contenu',
      linkAbout: 'À propos de Fazix',
      linkStaff: 'Staff et encadrement',
      linkNews: 'Actualités',
      linkPressKit: 'Kit de presse',
      linkApplyTeam: 'Postuler dans l\'équipe',
      linkContactMgmt: 'Contacter la direction',
      privacy: 'Politique de confidentialité',
      imprint: 'Mentions légales',
      cookieSettings: 'Paramètres des cookies',
      dsgvoRequests: 'Droits des personnes (RGPD)',
      copyright: '© 2026 Fazix Esports. Tous droits réservés.',
    },
    cookie: {
      title: 'Confidentialité et gestion des cookies',
      desc: 'Nous utilisons des cookies et technologies nécessaires pour assurer le fonctionnement sécurisé et conforme au RGPD de notre site.',
      acceptAll: 'Tout accepter',
      acceptEssential: 'Essentiels uniquement',
      customize: 'Personnaliser',
      saveCustom: 'Enregistrer les choix',
      essentialTitle: 'Technologies indispensables',
      essentialDesc: 'Nécessaires au fonctionnement technique et à la sécurité du site.',
      prefTitle: 'Préférences',
      prefDesc: 'Mémorise vos paramètres de langue et d\'affichage.',
      analyticsTitle: 'Mesure d\'audience',
      analyticsDesc: 'Statistiques anonymisées pour améliorer les performances.',
    },
    apply: {
      backHome: 'Retour à l\'accueil',
      title: 'REJOINDRE L\'ÉQUIPE',
      subtitle: 'Nous recrutons des joueurs titulaires pour notre équipe RLCS Europe et des talents prometteurs pour Fazix Academy.',
      tierMainTitle: 'Équipe Principale RLCS',
      tierMainDesc: 'Supersonic Legend (1900+ MMR) avec expérience compétitive.',
      tierAcademyTitle: 'Fazix Academy',
      tierAcademyDesc: 'Grand Champion 3 à SSL avec volonté de progression collective.',
      tierStaffTitle: 'Coaching et Encadrement',
      tierStaffDesc: 'Analystes vidéo, managers d\'équipe et coachs tactiques.',
      positionLabel: 'POSTE SOUHAITÉ *',
      posMain: 'Semi Esports',
      posAcademy: 'Autres équipes Fazix',
      posCoach: 'Coach / Analyste',
      posCreator: 'Créateur',
      ignLabel: 'Pseudo en jeu Rocket League (Epic / Steam)',
      realNameLabel: 'Nom complet',
      ageLabel: 'ÂGE *',
      countryLabel: 'PAYS & RÉGION DE SERVEUR *',
      emailLabel: 'Adresse email',
      discordLabel: 'Identifiant Discord (ex: pseudo)',
      roleLabel: 'Rôle / Position souhaitée',
      rankLabel: 'Rang 3v3 actuel et pic de MMR',
      trackerLabel: 'Lien Rocket League Tracker Network',
      expLabel: 'Expérience en tournoi et anciennes équipes',
      notesLabel: 'DISPONIBILITÉS & REMARQUES (OPTIONNEL)',
      msgLabel: 'Pourquoi rejoindre Fazix ?',
      consentText: 'J\'accepte le traitement de mes données conformément à la politique de confidentialité.',
      consentError: 'Veuillez accepter le traitement des données conformément à notre politique de confidentialité.',
      submitBtn: 'Envoyer ma candidature',
      submittingBtn: 'Envoi en cours...',
      reviewNote: 'Nous examinons les candidatures chaque semaine. Le règlement officiel des tournois RLCS requiert au minimum 13 ans (accord parental requis pour les mineurs).',
      successTitle: 'Candidature transmise !',
      successDesc: 'Merci pour votre candidature. Notre équipe esport examinera votre profil et vous contactera sur Discord.',
      backBtn: 'Retour à l\'accueil',
      submitAnother: 'Envoyer une autre candidature',
    },
    contact: {
      backHome: 'Retour à l\'accueil',
      title: 'CONTACTER LA DIRECTION',
      subtitle: 'Ligne directe pour les partenariats, propositions commerciales, invitations à des tournois et management esport.',
      directChannelsTitle: 'Canaux directs',
      directEmailTitle: 'Email direct',
      directEmailDesc: 'fazixesports@gmail.com',
      discordTitle: 'Communauté Discord',
      discordDesc: 'Tickets dans #support',
      hqTitle: 'Localisation',
      hqDesc: 'Rhénanie-du-Nord-Westphalie, Allemagne',
      responseWindowTitle: 'Délai de réponse',
      responseWindowHours: 'Lundi – Vendredi, 09h00 – 18h00 CET',
      trialsTitle: 'Recrutement joueurs',
      trialsDesc: 'Vous souhaitez rejoindre notre équipe RLCS ou Fazix Academy ? Utilisez notre formulaire de scouting.',
      trialsBtn: 'Postuler comme joueur →',
      topicLabel: 'OBJET DE LA DEMANDE *',
      formTitle: 'Envoyer un message',
      nameLabel: 'Votre nom',
      emailLabel: 'Adresse email',
      orgLabel: 'ORGANISATION / MARQUE (OPTIONNEL)',
      subjectLabel: 'Objet',
      messageLabel: 'Message',
      consentText: 'J\'accepte le traitement de mes données personnelles selon la politique de confidentialité.',
      consentError: 'Veuillez accepter le traitement des données conformément à notre politique de confidentialité.',
      submitBtn: 'Envoyer le message',
      submittingBtn: 'Envoi en cours...',
      rateLimitNotice: 'Les formulaires sont protégés. Les demandes commerciales sont traitées dans le respect strict de la confidentialité.',
      successTitle: 'Message reçu',
      successDesc: 'Merci pour votre prise de contact. Notre direction vous répondra dans les meilleurs délais.',
      sendAnother: 'Envoyer un autre message',
      catPartnership: 'Partenariats & Sponsors',
      catTransfers: 'Roster & Transferts',
      catTournaments: 'Tournois & Scrims',
      catPress: 'Presse & Médias',
      catGeneral: 'Direction générale',
    },
    creators: {
      backHome: 'Retour au menu',
      badge: 'Collectif Créateurs',
      title: 'CRÉATEURS DE CONTENU',
      subtitle: 'Streamers, freestylers et créateurs représentant Fazix sur Twitch, YouTube et TikTok.',
      watchR3ulexBtn: 'Regarder r3ulex sur Twitch',
      applyBtn: 'Postuler comme créateur',
      featuredBadge: 'Créateur en vedette',
      watchStreamBtn: 'Regarder le stream sur Twitch',
      hidePlayer: 'Masquer le lecteur',
      showPlayer: 'Lecteur en direct',
      tabAll: 'Toutes les plateformes',
      rosterTitle: 'TOUS LES CRÉATEURS & MÉDIAS',
      rosterSubtitle: 'Découvrez les streams en direct, vidéos YouTube et séries',
      visitChannel: 'Visiter la chaîne',
      joinCardTitle: 'Rejoindre le collectif créateurs',
      joinCardDesc: 'Vous êtes streamer Rocket League, créateur YouTube ou monteur ? Nous fournissons des partenariats matériel, du support graphique et une visibilité accrue.',
      joinCardLi1: 'Chaîne Twitch, YouTube ou TikTok',
      joinCardLi2: 'Planning régulier de diffusions',
      joinCardLi3: 'Opportunités de sponsoring matériel',
      applyNowBtn: 'Postuler maintenant',
      whyJoinTitle: 'POURQUOI STREAMER & CRÉER AVEC FAZIX ?',
      whyJoinSubtitle: 'Nous accompagnons nos créateurs avec du matériel haut de gamme, une mise en avant communautaire et des synergies RLCS.',
      perk1Title: 'Matériel & Partenariats',
      perk1Desc: 'Accès à des partenariats périphériques, setups de compétition et équipements partenaires.',
      perk2Title: 'Studio graphique dédié',
      perk2Desc: 'Overlays de stream sur mesure, miniatures YouTube, alertes sonores et animations visuelles.',
      perk3Title: 'Visibilité communautaire',
      perk3Desc: 'Mise en avant de vos diffusions auprès de notre communauté Discord, réseaux sociaux et site.',
      perk4Title: 'Bootcamps & Événements LAN',
      perk4Desc: 'Participez aux bootcamps de l’équipe, aux tournois communautaires et aux LANs européennes.',
      perksApplyBtn: 'Postuler au programme créateurs',
    },
  },
  ES: {
    nav: {
      items: {
        esports: 'Esports',
        creators: 'Creadores',
        partners: 'Socios',
        community: 'Comunidad',
        company: 'Club',
      },
      esportsDropdown: {
        rlcsTitle: 'Rocket League (RLCS)',
        rlcsSubtitle: 'Alineación principal para el circuito europeo',
        academyTitle: 'Fazix Academia',
        academySubtitle: 'Equipo academia 3v3 en clasificatorios regionales',
        creatorsTitle: 'Creadores de contenido',
        creatorsSubtitle: 'Streamers y freestylers',
        joinTitle: 'Únete al equipo',
        joinSubtitle: 'Pruebas para jugadores Supersonic Legend',
      },
      creatorsDropdown: {
        allTitle: 'Todos los creadores',
        allSubtitle: 'Nuestro equipo de streamers y creadores',
        r3ulexSubtitle: 'Streamer en Twitch y creador de Rocket League',
        kenorllSubtitle: 'Jugador de Rocket League y streamer',
        youtubeTitle: 'YouTube Fazix',
        youtubeSubtitle: 'Comms de partidos, resúmenes y repeticiones',
        tiktokTitle: 'Fazix TikTok',
        tiktokSubtitle: 'Vídeos cortos, jugadas y momentos destacados',
        applyTitle: 'Postularse como creador',
        applySubtitle: 'Forma parte de la red de streaming de Fazix',
      },
      partnersDropdown: {
        beyondSubtitle: 'Socio oficial de entrenamiento en Rocket League',
        rocSubtitle: 'Afiliado competitivo y torneos asociados',
        partnerWithTitle: 'Colabora con Fazix',
        partnerWithSubtitle: 'Patrocinios y propuestas comerciales',
      },
      communityDropdown: {
        discordTitle: 'Discord oficial',
        discordSubtitle: 'Comunidad activa con eventos periódicos',
        twitchTitle: 'Canal de Twitch',
        twitchSubtitle: 'Torneos en directo y retransmisiones',
        youtubeTitle: 'Canal de YouTube',
        youtubeSubtitle: 'Jugadas destacadas, scrims y análisis',
        tiktokTitle: 'TikTok y Clips',
        tiktokSubtitle: 'Vídeos cortos y mecánicas avanzadas',
      },
      companyDropdown: {
        aboutTitle: 'Sobre Fazix',
        aboutSubtitle: 'Nuestra organización y metas deportivas',
        careersTitle: 'Vacantes y Staff',
        careersSubtitle: 'Puestos de entrenadores, medios y directiva',
        pressTitle: 'Kit de prensa y medios',
        pressSubtitle: 'Logos oficiales, recursos gráficos y fotos (ZIP)',
        contactTitle: 'Contactar con dirección',
        contactSubtitle: 'Consultas comerciales y de gestión',
      },
      applyBtn: 'Postularse',
      languageLabel: 'Idioma',
    },
    hero: {
      title: 'FAZIX ESPORTS',
      subtitle: 'Club de Rocket League con sede en Alemania que compite en RLCS Europa. Alineaciones oficiales, calendario y pruebas abiertas para SSL.',
      applyBtn: 'Postularse',
      discordBtn: 'Unirse a nuestro Discord',
      scroll: 'BAJAR',
    },
    partners: {
      title: 'SOCIOS Y PATROCINADORES',
    },
    news: {
      latest: 'ÚLTIMAS',
      news: 'NOTICIAS',
      subtitle: 'Resultados de torneos, análisis de partidos y novedades del equipo en el circuito RLCS.',
      readMore: 'Leer artículo',
      close: 'Cerrar',
      noNewsTitle: 'SIN NOTICIAS POR EL MOMENTO',
      noNewsDesc: 'Aún no hay artículos publicados. Los resultados de partidos, actualizaciones de roster y noticias de torneos se publicarán aquí.',
    },
    roster: {
      tickerPro: 'PRO',
      tickerAcademy: 'ACADEMY',
      tickerCommunity: 'COMMUNITY',
      tierAcademyTitle: 'ACADEMY',
      tierAcademyDesc: 'En nuestros equipos Academy, los jugadores con talento adquieren su primera experiencia competitiva al más alto nivel regional.',
      tierMainTitle: 'PRO',
      tierMainDesc: 'En nuestros equipos Pro, nuestros jugadores compiten en las mejores ligas europeas contra los mejores.',
      tierCommunityTitle: 'COMMUNITY',
      tierCommunityDesc: 'Nuestra comunidad también participa con equipos amateur en ligas abiertas, priorizando la diversión y el crecimiento.',
      exploreBtn: 'VER EQUIPOS',
      collapseBtn: 'CERRAR EQUIPOS',
      divMain: 'RLCS EUROPE (PRINCIPAL)',
      divAcademy: 'FAZIX ACADEMIA',
      divCommunityTab: 'COMUNIDAD Y PRUEBAS',
      communityCardTitle: 'COMUNIDAD Y PRUEBAS ABIERTAS',
      communityCardDesc: 'Nuestros equipos comunitarios juegan copas semanales y torneos abiertos. Los jugadores SSL pueden hacer pruebas para Academia y Principal a través de Discord.',
      joinTrialsBtn: 'Unirse a pruebas en Discord',
      peakMmr: 'MMR MÁXIMO',
      winRate: 'PORCENTAJE VICTORIAS',
      mainCar: 'COCHE PRINCIPAL',
      competitiveSetup: 'EQUIPAMIENTO COMPETITIVO',
      controller: 'Mando',
      camera: 'Ajustes de cámara',
      display: 'Monitor',
      signatureMechanic: 'Mecánica destacada',
      showStarting: 'Mostrar titulares',
      seeMore: 'Ver más',
    },
    about: {
      titlePart1: 'SOBRE',
      titlePart2: 'NOSOTROS',
      headingSubtitle: 'QUIÉNES SOMOS',
      p1: 'Fazix eSports está centrado por completo en Rocket League, desde el talento emergente a partir de Platino hasta nuestros equipos de alto nivel SSL. Construimos una organización donde jugadores de cualquier rango encuentran un equipo fijo, progresan y compiten.',
      p2: 'Nuestras alineaciones participan con regularidad en ligas europeas, torneos abiertos, Rival Rush y clasificatorios de RLCS. Además de la competición oficial, organizamos copas comunitarias y torneos abiertos para cualquier equipo que busque medirse en cuadros justos.',
      p3: 'El rendimiento en la cancha nos impulsa, pero los valores pesan lo mismo. En Fazix, el trabajo en equipo, el respeto y una comunidad activa libre de toxicidad valen tanto como la victoria en el marcador.',
      applyButton: 'Postularse',
    },
    footer: {
      brandDesc: 'Club europeo de Rocket League que compite en RLCS. Sede en Alemania.',
      colCompetition: 'COMPETICIÓN',
      colCommunity: 'COMUNIDAD',
      colCompany: 'ORGANIZACIÓN',
      colGettingStarted: 'EMPEZAR',
      linkRlcs: 'RLCS Europa',
      linkAcademy: 'Fazix Academia',
      linkSchedule: 'Calendario de partidos',
      linkApplyRoster: 'Postularse al equipo →',
      linkDiscord: 'Discord (Comunidad)',
      linkTwitch: 'Canal de Twitch',
      linkSixMans: '6mans semanales',
      linkWatchParties: 'Watch Parties',
      linkCreators: 'Creadores de contenido',
      linkAbout: 'Sobre Fazix',
      linkStaff: 'Staff y dirección',
      linkNews: 'Noticias',
      linkPressKit: 'Kit de prensa',
      linkApplyTeam: 'Postularse para el equipo',
      linkContactMgmt: 'Contactar a dirección',
      privacy: 'Política de privacidad',
      imprint: 'Aviso legal',
      cookieSettings: 'Ajustes de cookies',
      dsgvoRequests: 'Derechos de los interesados (RGPD)',
      copyright: '© 2026 Fazix Esports. Todos los derechos reservados.',
    },
    cookie: {
      title: 'Ajustes de privacidad y cookies',
      desc: 'Usamos cookies y almacenamiento local conforme al RGPD para ofrecer una navegación segura y personalizada. Puede modificar sus preferencias en cualquier momento en el pie de página.',
      acceptAll: 'Aceptar todas',
      acceptEssential: 'Solo esenciales',
      customize: 'Personalizar',
      saveCustom: 'Guardar preferencias',
      essentialTitle: 'Tecnologías esenciales',
      essentialDesc: 'Estrictamente necesarias para el funcionamiento técnico y la gestión del consentimiento.',
      prefTitle: 'Preferencias',
      prefDesc: 'Recuerda su idioma seleccionado y opciones de interfaz.',
      analyticsTitle: 'Estadísticas y análisis',
      analyticsDesc: 'Medición anónima de visitas para optimizar el rendimiento de la web.',
    },
    apply: {
      backHome: 'Volver al inicio',
      title: 'ÚNETE AL EQUIPO',
      subtitle: 'Buscamos titulares para nuestro equipo RLCS Europa y talentos en desarrollo para Fazix Academy. Envía tu perfil competitivo.',
      tierMainTitle: 'Alineación Principal RLCS',
      tierMainDesc: 'Supersonic Legend (1900+ MMR) con experiencia competitiva.',
      tierAcademyTitle: 'Fazix Academy',
      tierAcademyDesc: 'Grand Champion 3 a SSL con enfoque en desarrollo en equipo.',
      tierStaffTitle: 'Cuerpo técnico y analistas',
      tierStaffDesc: 'Analistas de repeticiones, directores de equipo y entrenadores.',
      positionLabel: 'POSICIÓN *',
      posMain: 'Semi Esports',
      posAcademy: 'Otros equipos Fazix',
      posCoach: 'Entrenador / Analista',
      posCreator: 'Creador',
      ignLabel: 'Nombre en Rocket League (Epic / Steam)',
      realNameLabel: 'Nombre completo',
      ageLabel: 'EDAD *',
      countryLabel: 'PAÍS Y REGIÓN DE SERVIDOR *',
      emailLabel: 'Correo electrónico',
      discordLabel: 'Usuario de Discord (ej: nombre)',
      roleLabel: 'Posición o rol deseado',
      rankLabel: 'Rango 3v3 actual y MMR máximo',
      trackerLabel: 'Enlace de Rocket League Tracker Network',
      expLabel: 'Experiencia competitiva y equipos anteriores',
      notesLabel: 'DISPONIBILIDAD Y NOTAS (OPCIONAL)',
      msgLabel: '¿Por qué quieres unirte a Fazix?',
      consentText: 'Acepto el tratamiento de mis datos de acuerdo con la política de privacidad.',
      consentError: 'Por favor, acepte el tratamiento de datos según nuestra Política de Privacidad.',
      submitBtn: 'Enviar solicitud',
      submittingBtn: 'Enviando...',
      reviewNote: 'Revisamos las solicitudes semanalmente. Las reglas oficiales de los torneos de la RLCS requieren tener al menos 13 años (consentimiento parental requerido para menores).',
      successTitle: '¡Solicitud enviada!',
      successDesc: 'Gracias por enviar tu perfil. La dirección de esports revisará tu historial y te contactará por Discord.',
      backBtn: 'Volver al inicio',
      submitAnother: 'Enviar otra solicitud',
    },
    contact: {
      backHome: 'Volver al inicio',
      title: 'CONTACTAR DIRECCIÓN',
      subtitle: 'Línea de contacto para patrocinios comerciales, invitaciones a torneos y gestión del club de esports.',
      directChannelsTitle: 'Canales directos',
      directEmailTitle: 'Correo directo',
      directEmailDesc: 'fazixesports@gmail.com',
      discordTitle: 'Comunidad en Discord',
      discordDesc: 'Tickets en #support',
      hqTitle: 'Sede central',
      hqDesc: 'Renania del Norte-Westfalia, Alemania',
      responseWindowTitle: 'Horario de atención',
      responseWindowHours: 'Lunes – Viernes, 09:00 – 18:00 CET',
      trialsTitle: 'Pruebas de jugadores',
      trialsDesc: '¿Buscas una prueba para nuestro equipo de RLCS o Fazix Academy? Utiliza nuestro formulario para jugadores.',
      trialsBtn: 'Abrir solicitud de jugador →',
      topicLabel: 'TEMA DE LA CONSULTA *',
      formTitle: 'Enviar mensaje',
      nameLabel: 'Su nombre',
      emailLabel: 'Correo electrónico',
      orgLabel: 'ORGANIZACIÓN / MARCA (OPCIONAL)',
      subjectLabel: 'Asunto',
      messageLabel: 'Mensaje',
      consentText: 'Acepto el tratamiento de mis datos de conformidad con la política de privacidad RGPD.',
      consentError: 'Por favor, acepte el tratamiento de datos según nuestra Política de Privacidad.',
      submitBtn: 'Enviar mensaje',
      submittingBtn: 'Enviando...',
      rateLimitNotice: 'Envíos protegidos con límite de tasa. Las consultas comerciales se tratan bajo estricta confidencialidad.',
      successTitle: 'Mensaje recibido',
      successDesc: 'Gracias por ponerte en contacto. Nuestro equipo de gestión te responderá a la brevedad.',
      sendAnother: 'Enviar otro mensaje',
      catPartnership: 'Asociaciones y Patrocinios',
      catTransfers: 'Roster y Fichajes',
      catTournaments: 'Torneos y Scrims',
      catPress: 'Prensa y Medios',
      catGeneral: 'Gestión General',
    },
    creators: {
      backHome: 'Volver al resumen',
      badge: 'Equipo de Creadores',
      title: 'CREADORES DE CONTENIDO',
      subtitle: 'Streamers, freestylers y creadores que representan a Fazix en Twitch, YouTube y TikTok.',
      watchR3ulexBtn: 'Ver a r3ulex en Twitch',
      applyBtn: 'Postularse como creador',
      featuredBadge: 'Creador destacado',
      watchStreamBtn: 'Ver stream en Twitch',
      hidePlayer: 'Ocultar reproductor',
      showPlayer: 'Reproductor en vivo',
      tabAll: 'Todas las plataformas',
      rosterTitle: 'TODOS LOS CREADORES Y MEDIOS',
      rosterSubtitle: 'Descubre transmisiones en vivo, series de YouTube y vídeos',
      visitChannel: 'Visitar canal',
      joinCardTitle: 'Únete al equipo de creadores',
      joinCardDesc: '¿Eres streamer de Rocket League, creador de YouTube o editor de vídeo? Ofrecemos patrocinio de hardware, soporte creativo y amplificación para crecer juntos.',
      joinCardLi1: 'Canal en Twitch, YouTube o TikTok',
      joinCardLi2: 'Horario regular de transmisiones',
      joinCardLi3: 'Ventajas de patrocinio exclusivas',
      applyNowBtn: 'Solicitar ahora',
      whyJoinTitle: '¿POR QUÉ STREAMER Y CREAR EN FAZIX?',
      whyJoinSubtitle: 'Impulsamos a nuestros creadores con periféricos de élite, difusión en redes y vínculos directos con nuestros equipos RLCS.',
      perk1Title: 'Hardware y Patrocinios',
      perk1Desc: 'Acceso a colaboraciones con marcas de periféricos, configuraciones de torneo y equipamiento.',
      perk2Title: 'Soporte de diseño y estudio',
      perk2Desc: 'Overlays personalizados para directos, miniaturas de YouTube, alertas y diseño de animación propio.',
      perk3Title: 'Alcance en la comunidad',
      perk3Desc: 'Transmite ante miles de miembros a través de nuestro Discord, Twitter/X y portal oficial.',
      perk4Title: 'Acceso a Bootcamps y LANs',
      perk4Desc: 'Acompaña al equipo a concentraciones competitivas, copas comunitarias y torneos presenciales.',
      perksApplyBtn: 'Solicitar entrada al programa',
    },
  },
};
