// Single source of truth for all site content.
// Edit this file to update the site — no component changes needed.

export const profile = {
  name: 'Ramuel Batuigas',
  shortName: 'Ramuel Batuigas',
  location: 'Toronto, ON',
  email: 'rjbatuigas@gmail.com',
  links: {
    linkedin: 'https://linkedin.com/in/rjbatuigas',
    github: 'https://github.com/ManagementEngineer',
    site: 'https://www.ramuel.ca',
  },
  headline: 'I build fantasy sports products people pay for.',
  summary:
    'Founding engineer (AI & Product) at Kuvai by day. Creator of Fantasy League Lottery the rest of the time — a live, revenue-generating fantasy product I have run solo since 2022: PM, design, engineering, and growth, with AI agents as my team.',
} as const

export type Stat = { value: string; label: string; note?: string }

// Headline numbers for the hero. Traffic verified against GA4 (Aug 2026):
// peak month Aug 2024 = 8,921 users / 14,415 sessions / 32,132 page views.
// TODO(RJ): 10.7% conversion is from the FLL roadmap — confirm before publishing.
export const heroStats: Stat[] = [
  { value: '4', label: 'draft seasons shipped solo' },
  { value: '14,000+', label: 'visits in a peak draft month' },
  { value: '977', label: 'commits on one product since 2022' },
  { value: '10.7%', label: 'free-to-Pro conversion' },
]

export type Pos = 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST'

export type Project = {
  slug: string
  name: string
  url?: string
  tagline: string
  description: string
  stack: string[]
  highlights: string[]
  role: string
  period: string
  featured: boolean
  /* Draft-board framing */
  pos: Pos
  posLabel: string
  tier: 1 | 2
  statLine: string
  status: 'LIVE' | 'IN SEASON' | 'OFFSEASON'
}

export const projects: Project[] = [
  {
    slug: 'fantasy-league-lottery',
    name: 'Fantasy League Lottery',
    url: 'https://www.fantasyleaguelottery.com',
    tagline: 'The draft-night moment, productized',
    description:
      'A live, revenue-generating commissioner suite. Leagues build weighted draft lotteries (NBA-style, linear, or custom odds), then watch cinematic 3D reveals together — The Brawl, The Race, The Vault. Grown into a full toolkit: keeper reveals, waiver lotteries, punishment wheels, league polls, and Claude-powered features like League Constitution Q&A and Unbiased Rulings.',
    stack: ['Next.js', 'React', 'TypeScript', 'Three.js / R3F', 'Firebase', 'Stripe', 'Claude API', 'Sleeper API'],
    highlights: [
      'Live since 2022 · 977 commits · shipped and iterated through four draft seasons',
      'Paid Pro tier with 10.7% conversion and lotteries up 79–98% YoY',
      'Breathes with the fantasy calendar: traffic 10x’s every August — peak month, 8,900 players and 32,000 page views — with reveal scheduling and lifecycle emails to match',
      'AI features in production: constitution Q&A, unbiased dispute rulings, schedule recommendations',
    ],
    role: 'Creator — product, design, engineering, growth',
    period: '2022 – present',
    featured: true,
    pos: 'QB',
    posLabel: 'Franchise player',
    tier: 1,
    statLine: '977 commits · 4 draft seasons',
    status: 'LIVE',
  },
  {
    slug: 'fantasy-league-lab',
    name: 'Fantasy League Lab',
    url: 'https://fantasyleaguelab.com',
    tagline: 'Advice that knows your league',
    description:
      'Built on a gap every fantasy player hits: analyst advice only goes so far, because it doesn’t know your league — its settings, its managers, its roster construction. Lab imports your league’s full multi-season Yahoo history and studies how it actually behaves: manager drafting personalities, head-to-head records, category strengths, and Reach Rate — how far ahead of expert consensus each pick was made. Rankings tell you who’s good; Lab tells you how to win the league you’re in.',
    stack: ['Next.js', 'TypeScript', 'Yahoo Fantasy API', 'MongoDB', 'Redis', 'Recharts', 'Auth0', 'Stripe'],
    highlights: [
      'The gap it closes: generic advice ignores league settings, managers, and roster construction',
      'Multi-season league history: manager behaviour profiles, head-to-head records, category dominance',
      'Reach Rate: an original metric scoring every draft pick against expert consensus rankings',
      'Cross-season manager identity resolution on a notoriously inconsistent API',
    ],
    role: 'Solo experiment — product, data, engineering',
    period: '2025',
    featured: true,
    pos: 'RB',
    posLabel: 'Data workhorse',
    tier: 2,
    statLine: 'League-specific win intel · Yahoo API',
    status: 'OFFSEASON',
  },
  {
    slug: 'pool-reveal',
    name: 'Pool Reveal',
    url: 'https://poolreveal.com',
    tagline: 'Group picks without the sign-up wall',
    description:
      "Office pools, prediction games, and squares — built around one product insight: participants should never need an account. Every player gets a unique pick link; the key is the identity. Four pool types (Pick'em, Squares, Bracket, Over/Under) with a clean free/Pro line and a shared live reveal.",
    stack: ['Next.js', 'React', 'TypeScript', 'Firebase', 'PayPal'],
    highlights: [
      'Frictionless participant model: zero sign-up, link-as-identity',
      'Deliberate free/Pro packaging: every pool type free, depth features paid',
      'Design system in oklch with mandatory light + dark themes',
    ],
    role: 'Solo experiment — product, design, engineering',
    period: '2026',
    featured: true,
    pos: 'WR',
    posLabel: 'Big-play upside',
    tier: 2,
    statLine: 'Zero-signup participant model',
    status: 'LIVE',
  },
  {
    slug: 'league-rings',
    name: 'League Rings',
    url: 'https://leaguerings.com',
    tagline: 'Championship rings for fantasy leagues',
    description:
      'A physical-product bet run like a product org: the buyer is the commissioner, not the champion; the sales window is November because casting lead times make a post-championship order too late; break-even is six rings. Docs-first operation with explicit gates before further investment and a written data firewall between this and my other products.',
    stack: ['Shopify', 'Printify', 'Claude Code agents'],
    highlights: [
      'Unit economics and go/no-go gates written down before a dollar was spent',
      'Ten specialized AI agents run merchandising, copy, SEO, and growth',
      'Privacy governance: a documented consent wall between businesses',
    ],
    role: 'Solo experiment — strategy, ops',
    period: '2026',
    featured: true,
    pos: 'K',
    posLabel: 'Specialist',
    tier: 2,
    statLine: 'Physical product · unit economics',
    status: 'IN SEASON',
  },
]

// Work experience (prose-only on the site; helix-tools repo is private/internal).
export type Experience = {
  role: string
  company: string
  location: string
  start: string
  end: string
  bullets: string[]
}

export const experience: Experience[] = [
  {
    role: 'Founding Engineer — AI & Product',
    company: 'Kuvai (AI Applied)',
    location: 'Toronto, ON',
    start: '2024',
    end: 'Present',
    bullets: [
      'Founding team on an AI-teammates platform: agents grounded in company documents, connected to the tools businesses already use, with human approval on every action.',
      'The glue guy — chose the tech stack, own UX and UI, define and ship MVPs.',
      'Built LLM document-extraction and reconciliation pipelines for insurance operations: typed structured outputs, measured against ground-truth evaluation sets.',
    ],
  },
  {
    role: 'Area Manager',
    company: 'Amazon',
    location: 'Toronto, ON',
    start: 'Feb 2020',
    end: 'May 2021',
    bullets: [
      'Increased station capacity 21% and cut process touch points 50% — an extra 134,000 same-day packages dispatched annually.',
      'Built a VBA automation that cut daily report prep from 45 min to 3 min, adopted across all Canadian delivery stations.',
      'Led the top-performing Prime Free Same Day station in Canada: 3,500 packages daily at 98.85% success.',
    ],
  },
  {
    role: 'Analytics roles',
    company: 'TTC · York Region · Loblaw · Clearbridge Mobile',
    location: 'Greater Toronto Area',
    start: '2016',
    end: '2018',
    bullets: [
      'Reliability engineering on TTC subway doors (Weibull analysis, K-means fault clustering).',
      'Front-end design and UAT leadership for York Region’s fleet management system.',
      'Supply chain analytics at Loblaw; mobile QA automation at Clearbridge.',
    ],
  },
]

export const education = [
  {
    school: 'George Brown College',
    credential: 'Applied A.I. Solutions Development (Postgraduate)',
    period: '2023',
  },
  {
    school: 'University of Waterloo',
    credential: 'BASc Honours, Management Engineering',
    period: '2014 – 2019',
  },
]

export const skills = {
  product: [
    'Roadmaps with decision logs',
    'Pricing & packaging tests',
    'Funnel & cohort analysis',
    'Fantasy calendar planning',
  ],
  build: ['React / Next.js', 'TypeScript', 'Vercel AI SDK', 'MongoDB · Firebase', 'Auth0 · AWS S3', 'Three.js'],
  ai: [
    'Claude & OpenAI APIs in production',
    'Claude Code agents & skills, daily',
    'LLM extraction, evals & PII redaction (Presidio)',
  ],
  fantasy: [
    '15 years as a league commissioner',
    'Drafts, waivers, trades, start/sit',
    'Sleeper & Yahoo Fantasy APIs',
    'Expert consensus ranking data',
  ],
}
