/**
 * Event Templates for the Night City Stock Exchange
 * Defines random market events that affect stock prices by sector
 */

export enum EventType {
  CORPORATE_WAR = 'CORPORATE_WAR',
  DATA_LEAK = 'DATA_LEAK',
  HOSTILE_TAKEOVER = 'HOSTILE_TAKEOVER',
  PRODUCT_LAUNCH = 'PRODUCT_LAUNCH',
  GOVERNMENT_CONTRACT = 'GOVERNMENT_CONTRACT',
  CYBERATTACK = 'CYBERATTACK',
  SCANDAL = 'SCANDAL',
  BREAKTHROUGH = 'BREAKTHROUGH',
}

export interface EventTemplate {
  titles: Array<string>
  descriptions: Array<string>
  affectedSectors: Array<string>
  impactRange: [number, number] // [min, max] percentage modifier per tick
  durationRange: [number, number] // [min, max] duration in milliseconds
  isPositive: boolean // Whether this event type is generally positive
}

export const EVENT_TEMPLATES: Record<EventType, EventTemplate> = {
  [EventType.CORPORATE_WAR]: {
    titles: [
      'Arasaka-Militech Tensions Rise!',
      'Corporate War Escalates in Night City',
      'Armed Conflict Between Corps Reported',
      'Security Forces Clash in the Streets',
    ],
    descriptions: [
      'Security and military contractors see increased demand as corporate tensions escalate.',
      'Private military companies report surge in contracts amid corporate conflict.',
      'Defense sector stocks rally as corporations arm for conflict.',
    ],
    affectedSectors: ['Security', 'Military Contractors', 'Heavy Industry'],
    impactRange: [0.03, 0.08], // 3-8% boost per tick
    durationRange: [60000, 180000], // 1-3 minutes
    isPositive: true,
  },

  [EventType.DATA_LEAK]: {
    titles: [
      'Massive Data Breach Detected!',
      'Corporate Secrets Exposed on the Net',
      'Netrunner Attack Compromises Systems',
      'Sensitive Data Leaked to Darknet',
    ],
    descriptions: [
      'Technology and security stocks face uncertainty as hackers expose corporate secrets.',
      'Cyberware manufacturers scramble to patch vulnerabilities after major breach.',
      'Stock prices tumble as confidential data spreads across Night City networks.',
    ],
    affectedSectors: ['Technology', 'Biotechnology', 'Telecommunications'],
    impactRange: [-0.06, -0.02], // 2-6% drop per tick
    durationRange: [45000, 120000], // 45s-2 minutes
    isPositive: false,
  },

  [EventType.HOSTILE_TAKEOVER]: {
    titles: [
      'Hostile Takeover Attempt Underway!',
      'Corporate Raider Targets Major Corp',
      'Merger Rumors Rock the Market',
      'Acquisition Battle Intensifies',
    ],
    descriptions: [
      'Financial services stocks surge as merger and acquisition activity heats up.',
      'Investment firms see increased trading volume amid takeover speculation.',
      'Corporate restructuring rumors drive market volatility.',
    ],
    affectedSectors: ['Financial Services', 'Conglomerate'],
    impactRange: [0.02, 0.06], // 2-6% boost per tick
    durationRange: [90000, 240000], // 1.5-4 minutes
    isPositive: true,
  },

  [EventType.PRODUCT_LAUNCH]: {
    titles: [
      'Revolutionary Product Unveiled!',
      'New Tech Disrupts the Market',
      'Breakthrough Consumer Device Announced',
      'Major Product Launch Exceeds Expectations',
    ],
    descriptions: [
      'Consumer goods and technology stocks rally on exciting new product announcements.',
      'Market responds positively to innovative product launches.',
      'Investors pile into consumer tech on strong launch reception.',
    ],
    affectedSectors: ['Consumer Goods', 'Technology', 'Media'],
    impactRange: [0.02, 0.05], // 2-5% boost per tick
    durationRange: [60000, 150000], // 1-2.5 minutes
    isPositive: true,
  },

  [EventType.GOVERNMENT_CONTRACT]: {
    titles: [
      'Massive Government Contract Awarded!',
      'NUSA Awards Defense Contract',
      'Federal Funding Boost Announced',
      'Public Sector Deal Signed',
    ],
    descriptions: [
      'Military contractors and heavy industry see boost from government spending.',
      'Defense sector rallies on major federal contract announcements.',
      'Infrastructure stocks climb on public sector investment news.',
    ],
    affectedSectors: [
      'Military Contractors',
      'Heavy Industry',
      'Transportation',
    ],
    impactRange: [0.03, 0.07], // 3-7% boost per tick
    durationRange: [90000, 180000], // 1.5-3 minutes
    isPositive: true,
  },

  [EventType.CYBERATTACK]: {
    titles: [
      'Cyberattack Cripples Infrastructure!',
      'Major Systems Go Dark After Hack',
      'Ransomware Hits Corporate Networks',
      'Digital Terrorism Strikes Night City',
    ],
    descriptions: [
      'Infrastructure and energy stocks plummet as cyberattacks disrupt operations.',
      'Transportation and telecom sectors reel from coordinated cyber assault.',
      'Critical systems offline as corporations scramble to respond to attacks.',
    ],
    affectedSectors: ['Energy', 'Transportation', 'Telecommunications'],
    impactRange: [-0.05, -0.02], // 2-5% drop per tick
    durationRange: [60000, 150000], // 1-2.5 minutes
    isPositive: false,
  },

  [EventType.SCANDAL]: {
    titles: [
      'Corporate Scandal Rocks Market!',
      'Executive Misconduct Exposed',
      'Fraud Allegations Surface',
      'Corruption Investigation Launched',
    ],
    descriptions: [
      'Financial services and media stocks tumble on scandal revelations.',
      'Investor confidence shaken by corporate misconduct allegations.',
      'Stock prices dive as investigation details emerge.',
    ],
    affectedSectors: ['Financial Services', 'Media', 'Healthcare'],
    impactRange: [-0.04, -0.01], // 1-4% drop per tick
    durationRange: [60000, 180000], // 1-3 minutes
    isPositive: false,
  },

  [EventType.BREAKTHROUGH]: {
    titles: [
      'Medical Breakthrough Announced!',
      'Revolutionary Treatment Discovered',
      'Biotech Innovation Stuns Scientists',
      'Life-Changing Technology Unveiled',
    ],
    descriptions: [
      'Healthcare and biotech stocks soar on breakthrough announcement.',
      'Medical sector sees surge in investment following research breakthrough.',
      'Biotechnology firms rally on promising clinical results.',
    ],
    affectedSectors: ['Healthcare', 'Biotechnology'],
    impactRange: [0.04, 0.1], // 4-10% boost per tick
    durationRange: [120000, 300000], // 2-5 minutes
    isPositive: true,
  },
}

/**
 * Get a random event type
 */
export function getRandomEventType(): EventType {
  const eventTypes = Object.values(EventType)
  return eventTypes[Math.floor(Math.random() * eventTypes.length)]
}

/**
 * Get a random value within a range
 */
export function getRandomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/**
 * Get a random element from an array
 */
export function getRandomElement<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)]
}
