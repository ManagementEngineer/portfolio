// Home page content. Diagrams are drawn from the node and edge data below,
// which was taken from each project's code. Kuvai is described in prose only.

export const opening = {
  keys: ['AI engineer', 'Kuvai', 'Toronto'],
  claim: 'A developer with a product hat. Obsessed with the product, and the customer always comes first.',
  statement:
    "AI engineer who has worked at every level: the plant floor, the executive table, and the customer's inbox.",
  paras: [
    "I started in operations. At Toyota and at Amazon I worked beside front-line associates, where a change only counts if the person doing the job can use it. At Kuvai I report to the CTO and CEO and help decide what we build. On my own product I answer paying customers myself.",
    "I believe in Toyota's business principles, and I carry them into every problem I solve, AI included.",
  ],
  method: [
    { verb: 'Ask', text: 'I gather ideas by asking people.', more: 'He asks first. His product has an ideas board where customers vote.' },
    { verb: 'Measure', text: 'I validate ideas by looking at data.', more: 'He measures. One product of his tracks 133 different events.' },
    { verb: 'Find the gap', text: 'I find the gaps.', more: 'He found that buyers pay to get past a limit, not for the 3D show.' },
    { verb: 'Fix it', text: 'I find the solution and build it.', more: 'He rewrote the pitch around those limits. August brought in $3,917.' },
  ],
}

/* ---------- Figures ---------- */

export type Fig = { value: string; what: string; window: string; source: string; popoy?: string }

/* ---------- Range ---------- */

export type RangeRow = {
  place: string
  url?: string
  role: string
  years: string
  who: string
  text: string
  fig?: Fig
}

export const range: RangeRow[] = [
  {
    place: 'Toyota',
    role: 'Production engineer, internship',
    years: '2018',
    who: 'Engineers and front-line team members',
    text: 'The parts I designed made it possible to manufacture every RAV4 built in Canada. I worked with Toyota engineers across North America, and on the floor with the people building the cars.',
  },
  {
    place: 'Amazon',
    role: 'Area manager',
    years: '2020 – 2021',
    who: 'Front-line associates',
    text: "I ran Canada's top Prime same-day delivery station. I also wrote an automation script that cut the time managers spent on a report from 2 hours to 5 minutes. Area managers all over Canada used it.",
    fig: {
      value: '3,500',
      what: 'packages a day, at 98.85% success',
      window: '2020 – 2021',
      source: 'station record',
      popoy: '3,500 packages a day. Top same-day station in Canada.',
    },
  },
  {
    place: 'Kuvai',
    url: 'https://kuvai.com',
    role: 'AI engineer',
    years: '2024 – present',
    who: 'The CTO and the CEO',
    text: "I joined pre-seed, before the company had its first investor, and I report to both. I convinced the CTO to move the product from Streamlit to JavaScript and built the engineering team's AI development pipeline, from Jira ticket to a deploy on QA.",
  },
  {
    place: 'Fantasy League Lottery',
    url: 'https://www.fantasyleaguelottery.com',
    role: 'Founder',
    years: '2022 – present',
    who: 'Paying customers',
    text: 'I answer every support email and refund request myself. One refund became a product rule with a test behind it.',
    fig: { value: '537', what: 'paying accounts, of 3,835 registered', window: '27 Feb – 4 Sep 2026', source: 'own reports' },
  },
]

/* ---------- Diagrams ---------- */

export type Group = 'C' | 'S' | 'D' | 'A' | 'X'

export const groupWord: Record<Group, string> = {
  C: 'Client',
  S: 'Server',
  D: 'Data',
  A: 'AI',
  X: 'External',
}

export type SysNode = { id: string; label: string; sub: string; lane: 0 | 1 | 2 | 3; row: 0 | 1 | 2 | 3 }
export type SysEdge = { from: string; to: string; kind: 'call' | 'message'; label: string; both?: boolean }
export type System = { title: string; nodes: SysNode[]; edges: SysEdge[] }

export type FlowStep = { kind: 'work' | 'check' | 'wait'; label: string; note: string; nodes: string[] }
export type Flow = { title: string; steps: FlowStep[]; caption?: string }

export type Project = {
  id: string
  name: string
  role: string
  years: string
  paras: string[]
  timeline?: { when: string; text: string }[]
  image?: { src: string; alt: string; caption: string }
  figs: Fig[]
  system?: System
  flow?: Flow
  stack: { key: string; text: string }[]
  links: { label: string; href: string; internal?: boolean }[]
}

export const projects: Project[] = [
  {
    id: 'kuvai',
    name: 'Kuvai',
    role: 'AI engineer',
    years: '2024 – present',
    paras: [
      'Kuvai lets a business build a team of AI teammates, such as an assistant, a bookkeeper or a research analyst. You give each one a role, instructions and your documents, and it chats, runs tasks on a schedule, watches the web and pulls data out of files. It runs on web, Mac and iPhone.',
      "I joined pre-seed, before the company had its first investor. I report to the CTO and CEO, and my work runs from engineering to product. I helped decide the tech stack and build the product. I also built the engineering team's AI development pipeline end to end: it starts by picking up a Jira ticket and ends with a deploy on QA. Automated Playwright tests run along the way, and each pull request carries screenshots, and videos when needed, as proof the change works.",
      'I also led the macOS and iOS builds, from the first build through App Store submission to approval.',
      'I started on GPT-3.5, when context management, prompt engineering and RAG were problems you felt every day and solved by hand. I was one of the first users of the AI SDK, and I convinced our CTO to move the product from Streamlit in Python to JavaScript.',
      'I have worked on agent setup, scheduled tasks, web monitoring, document extraction, masking of personal information before a model call, billing and credits, and the pipeline that ships it.',
    ],
    image: {
      src: '/kuvai-team.jpg',
      alt: 'Five AI teammates around the Kuvai logo: Mia the personal assistant, Maya the bookkeeper, Jordan the sales coordinator, Priya the research analyst and Sam the customer success manager, with Priya handing a finding to Jordan.',
      caption: 'What a customer sees: a team of AI teammates, each connected to their tools, handing work to each other. Image from kuvai.com.',
    },
    timeline: [
      { when: 'Jul 2024', text: 'Started the JavaScript version of the product on the AI SDK: login, streaming chat, email drafting and a task scheduler, deployed within its first week.' },
      { when: 'Jul 2024', text: 'Added Anthropic, Google, Mistral and Cohere beside OpenAI, with the model switchable from configuration.' },
      { when: 'Jul 2024', text: 'Built a scheduler the model operates through tool calls. It later became the product\'s agents.' },
      { when: 'Jul – Aug 2024', text: 'Wrote the WebSocket server that pushes results from the back-end engine into live chats, with progress bars.' },
      { when: 'Aug – Sep 2024', text: 'Worked out role prompts and how much user context to put in each prompt, by hand.' },
      { when: 'Oct 2024', text: 'Integrated Microsoft Presidio to mask personal data before it reaches the model and restore it in the reply, across chat, email and scheduled tasks.' },
      { when: 'Nov 2024', text: 'Added a learnings memory so the assistant can reuse earlier solutions in later conversations.' },
      { when: 'Dec 2024', text: 'Moved login to Auth0, with refresh and idle-session handling.' },
      { when: 'Mar – Apr 2025', text: 'Added persistent chat history, a retrieval tool for FAQs, diagrams and a draft canvas to the chat.' },
      { when: 'May – Jul 2025', text: 'Hardened the app: route middleware, input validation, security headers, a content security policy and HTML sanitization.' },
      { when: 'Jun, Sep 2025', text: 'Found and fixed memory leaks and a database connection storm in the real-time server.' },
      { when: 'Oct – Dec 2025', text: 'Built Stripe billing: webhooks and an in-app upgrade flow with plans and credits.' },
      { when: 'Dec 2025', text: 'Migrated the app to AI SDK 5.' },
      { when: 'Nov 2025 – Jan 2026', text: 'Added enterprise single sign-on with role mapping, and social login.' },
      { when: 'Feb – Jun 2026', text: 'Worked on the web monitor, the agent builder and the hire-a-teammate flow.' },
      { when: 'Apr 2026', text: 'Set up the team\'s Claude Code sub-agents, commands and rules, the base of the AI development pipeline.' },
    ],
    figs: [],
    stack: [
      { key: 'build', text: 'TypeScript, Next.js, React, Python, MongoDB' },
      { key: 'AI', text: 'AI SDK, OpenAI, Anthropic, Google, one model layer across all three, RAG, Microsoft Presidio' },
      { key: 'ship', text: 'Docker, AWS, GitHub Actions, macOS and iOS apps, App Store review' },
    ],
    links: [{ label: 'kuvai.com', href: 'https://kuvai.com' }],
  },
  {
    id: 'fll',
    name: 'Fantasy League Lottery',
    role: 'Founder, solo, end to end',
    years: '2022 – present',
    paras: [
      'Every fantasy league has to decide who drafts first, and it usually ends in an argument. A commissioner sets the odds, the server seals the draw, and the whole league watches the reveal together. More than 43,900 lotteries have been run on it. At a standard 12 teams a league, that is over half a million draft spots decided.',
      'I wrote the core of it by hand, before AI coding tools existed. Leagues kept using it for years with nobody touching it. In 2026 I added a paid tier and brought in an agent team to help me build on top of that core. I still run all of it: product, engineering, pricing and support.',
    ],
    figs: [
      {
        value: '14%',
        what: 'paid, 537 of 3,835 registered accounts',
        window: '27 Feb – 4 Sep 2026',
        source: 'own reports',
        popoy: '537 people paid. Nobody made them.',
      },
      {
        value: '526,800',
        what: 'draft spots decided: 43,900 lotteries at a standard 12 teams each',
        window: 'to Nov 2026',
        source: 'site count × 12',
        popoy: 'Half a million draft spots decided. On something he wrote by hand.',
      },
      {
        value: 'CA$11,000',
        what: 'earned from the product',
        window: 'to Nov 2026',
        source: 'own records',
        popoy: "CA$11,000. That's a lot of kibbles.",
      },
    ],
    system: {
      title: 'Fantasy League Lottery',
      nodes: [
        { id: 'X1', label: 'Firebase Auth', sub: 'sign-in', lane: 0, row: 0 },
        { id: 'C1', label: 'Web app', sub: 'Next.js, React', lane: 0, row: 1 },
        { id: 'C2', label: '3D reveals', sub: 'three.js', lane: 0, row: 2 },
        { id: 'S1', label: 'API routes', sub: '82 handlers', lane: 1, row: 1 },
        { id: 'S2', label: 'Draw engine', sub: 'weighted sampler', lane: 1, row: 2 },
        { id: 'X2', label: 'Payments', sub: 'Stripe, PayPal', lane: 2, row: 0 },
        { id: 'D1', label: 'Firestore', sub: 'server access only', lane: 2, row: 1 },
        { id: 'A1', label: 'Claude Haiku 4.5', sub: 'rule-book answers', lane: 2, row: 2 },
        { id: 'S3', label: 'Cron routes', sub: '4 schedules', lane: 1, row: 3 },
        { id: 'X3', label: 'Resend', sub: 'email', lane: 2, row: 3 },
      ],
      edges: [
        { from: 'C1', to: 'X1', kind: 'call', label: 'sign in' },
        { from: 'C1', to: 'S1', kind: 'call', label: 'Bearer token' },
        { from: 'C1', to: 'C2', kind: 'call', label: 'render' },
        { from: 'S1', to: 'S2', kind: 'call', label: 'draw' },
        { from: 'S1', to: 'D1', kind: 'call', label: 'read, write' },
        { from: 'S1', to: 'X2', kind: 'call', label: 'checkout' },
        { from: 'S1', to: 'A1', kind: 'call', label: 'prompt' },
        { from: 'S3', to: 'X3', kind: 'message', label: 'emails' },
      ],
    },
    flow: {
      title: 'A draw, from sealed to verified',
      steps: [
        { kind: 'work', label: 'Create', note: 'The commissioner sets the teams and the odds.', nodes: ['C1', 'S1'] },
        { kind: 'work', label: 'Draw', note: 'The server runs the weighted draw. The browser never decides the order.', nodes: ['S1', 'S2'] },
        { kind: 'work', label: 'Seal', note: 'The inputs and the result are hashed with SHA-256 and stored.', nodes: ['S1', 'D1'] },
        { kind: 'wait', label: 'Hold', note: 'The order is withheld until the scheduled reveal time.', nodes: ['D1'] },
        { kind: 'work', label: 'Reveal', note: 'The league watches a show that animates toward the stored order.', nodes: ['C1', 'C2'] },
        { kind: 'check', label: 'Verify', note: 'Anyone can recompute the hash from the published inputs.', nodes: ['C1'] },
      ],
      caption:
        'The hash is a commitment to the result. It does not yet include a secret value, which is the next change I am making to it.',
    },
    stack: [
      { key: 'C', text: 'Next.js 15, React 19, TypeScript, Tailwind 4, three.js with react-three-fiber' },
      { key: 'S', text: 'Next.js API routes on Vercel, Vercel Cron' },
      { key: 'D', text: 'Cloud Firestore through the Admin SDK' },
      { key: 'A', text: 'Claude Haiku 4.5 over HTTPS' },
      { key: 'X', text: 'Firebase Auth, Stripe, PayPal, Resend, Sleeper and Yahoo APIs, Sentry, GA4' },
      { key: 'ship', text: 'Vitest with 418 test cases, GitHub Actions' },
    ],
    links: [
      { label: 'fantasyleaguelottery.com', href: 'https://www.fantasyleaguelottery.com' },
      { label: 'How I found what people pay for', href: '/work/what-sells', internal: true },
      { label: 'Ten AI tools, measured and cut', href: '/work/ai-credits', internal: true },
    ],
  },
  {
    id: 'immortal',
    name: 'Immortal Drafts',
    role: 'Solo, end to end, live and free',
    years: '2026',
    paras: [
      'A free browser game for esports fans who follow the pro scene more than they play. You draft a team from historic pro rosters across five titles and watch it play through the tournament.',
      'The simulation gives the same result in the browser and on the server, so the server can replay any run and keep its own record. It went live two days after I wrote the spec.',
    ],
    figs: [
      {
        value: '2,398',
        what: 'players in the first four days',
        window: '1 – 4 Nov 2026',
        source: 'own reports',
        popoy: 'Two posts on Reddit. No ads. 2,398 players.',
      },
      {
        value: '1,443',
        what: 'unit test cases, plus 384 end-to-end',
        window: 'on 14 Nov 2026',
        source: 'repo count',
        popoy: 'He tests more than he talks.',
      },
    ],
    system: {
      title: 'Immortal Drafts',
      nodes: [
        { id: 'C1', label: 'Web app', sub: 'Next.js, Zustand', lane: 0, row: 0 },
        { id: 'C2', label: 'Sim engine', sub: 'pure TypeScript', lane: 0, row: 1 },
        { id: 'S1', label: 'Route handlers', sub: '66 routes', lane: 1, row: 0 },
        { id: 'S2', label: 'Replay verifier', sub: 'same engine', lane: 1, row: 1 },
        { id: 'D2', label: 'Content', sub: 'rosters, JSON', lane: 2, row: 1 },
        { id: 'D1', label: 'Postgres', sub: 'Supabase', lane: 2, row: 0 },
        { id: 'S3', label: 'Daily seeds', sub: 'pins a fair seed', lane: 1, row: 2 },
        { id: 'S4', label: 'Cron', sub: 'daily, 05:05 UTC', lane: 1, row: 3 },
        { id: 'X1', label: 'Email and push', sub: 'Resend, Web Push', lane: 2, row: 3 },
      ],
      edges: [
        { from: 'C1', to: 'S1', kind: 'call', label: 'seed, picks' },
        { from: 'C1', to: 'C2', kind: 'call', label: 'play' },
        { from: 'S1', to: 'S2', kind: 'call', label: 'replay' },
        { from: 'S2', to: 'C2', kind: 'call', label: 'same code' },
        { from: 'S1', to: 'D1', kind: 'call', label: 'store' },
        { from: 'S2', to: 'D2', kind: 'call', label: 'rosters' },
        { from: 'S3', to: 'D1', kind: 'call', label: '' },
        { from: 'S4', to: 'X1', kind: 'message', label: 'reminders' },
      ],
    },
    flow: {
      title: 'A run, from seed to server record',
      steps: [
        { kind: 'work', label: 'Seed', note: 'One seed deals every spin. Each decision gets its own random stream.', nodes: ['C1', 'C2'] },
        { kind: 'work', label: 'Draft', note: 'The player picks five from the rosters the seed deals.', nodes: ['C1'] },
        { kind: 'work', label: 'Play', note: 'The browser plays the tournament with integer-only maths.', nodes: ['C2'] },
        { kind: 'work', label: 'Send', note: 'The browser sends the seed and the picks, never a result.', nodes: ['C1', 'S1'] },
        { kind: 'check', label: 'Replay', note: 'The server replays the draft and rejects any pick the seed never dealt.', nodes: ['S1', 'S2', 'D2'] },
        { kind: 'work', label: 'Record', note: 'The server plays its own run and stores that one.', nodes: ['S2', 'C2', 'S1', 'D1'] },
      ],
      caption:
        'A test scans the engine source and fails on Math.random, clocks or floating-point curves, so both sides agree bit for bit.',
    },
    stack: [
      { key: 'C', text: 'Next.js 16, React 19, TypeScript, Tailwind 4, Zustand 5, Motion, Serwist PWA' },
      { key: 'S', text: 'Next.js route handlers on Vercel, one cron' },
      { key: 'D', text: 'Supabase Postgres with 45 migrations, static JSON content' },
      { key: 'X', text: 'Supabase Auth, Resend, Web Push, Vercel BotID, GA4' },
      { key: 'ship', text: 'Vitest, Playwright, a commit hook that blocks on type and content checks' },
    ],
    links: [{ label: 'immortaldrafts.com', href: 'https://immortaldrafts.com' }],
  },
  {
    id: 'askpinoy',
    name: 'AskPinoy',
    role: 'Solo, end to end, pre-launch',
    years: '2026',
    paras: [
      'People ask Facebook groups for a Filipino plumber in Mississauga or a caterer in Scarborough. AskPinoy is the answer you can link: a directory of Filipino-owned businesses in Toronto and the GTA, built around trust.',
      'It is built and deployed, and opens once 60 businesses are listed. No business appears unless its owner has confirmed the details, and the database enforces that.',
    ],
    figs: [
      {
        value: '3,297',
        what: 'database test assertions',
        window: 'on 31 Oct 2026',
        source: 'repo count',
        popoy: '3,297 checks before a single listing went live. He is careful.',
      },
    ],
    system: {
      title: 'AskPinoy',
      nodes: [
        { id: 'C1', label: 'Browser', sub: 'server-rendered', lane: 0, row: 1 },
        { id: 'X1', label: 'Turnstile', sub: 'bot check', lane: 1, row: 0 },
        { id: 'S1', label: 'Next.js app', sub: 'server actions', lane: 1, row: 1 },
        { id: 'S2', label: 'Data package', sub: 'typed access', lane: 1, row: 2 },
        { id: 'D1', label: 'Postgres', sub: 'RLS, triggers', lane: 2, row: 2 },
        { id: 'S3', label: 'pg_cron', sub: 'scheduled purge', lane: 2, row: 3 },
        { id: 'D2', label: 'Storage', sub: 'photos', lane: 2, row: 1 },
        { id: 'X2', label: 'Resend', sub: 'email', lane: 2, row: 0 },
      ],
      edges: [
        { from: 'C1', to: 'S1', kind: 'call', label: 'form post' },
        { from: 'S1', to: 'X1', kind: 'call', label: 'verify' },
        { from: 'S1', to: 'S2', kind: 'call', label: 'all data' },
        { from: 'S2', to: 'D1', kind: 'call', label: 'RPC' },
        { from: 'S1', to: 'D2', kind: 'call', label: 'photos' },
        { from: 'S1', to: 'X2', kind: 'message', label: 'email' },
        { from: 'S3', to: 'D1', kind: 'message', label: 'purge' },
      ],
    },
    flow: {
      title: 'A listing, from submitted to published',
      steps: [
        { kind: 'work', label: 'Submit', note: 'A visitor suggests a business. The bot check runs before any write.', nodes: ['C1', 'S1', 'X1'] },
        { kind: 'check', label: 'Limit', note: 'A database function limits by IP hash and inserts the row as pending.', nodes: ['S2', 'D1'] },
        { kind: 'wait', label: 'Hidden', note: 'Row-level security keeps unpublished rows off the site.', nodes: ['D1'] },
        { kind: 'check', label: 'Confirm', note: 'I phone the business and record that the owner confirmed the details.', nodes: ['S1'] },
        { kind: 'check', label: 'Publish', note: 'A database trigger refuses to publish anything unconfirmed.', nodes: ['S2', 'D1'] },
        { kind: 'work', label: 'Live', note: 'Cache tags are invalidated and the public page appears.', nodes: ['S1', 'C1'] },
      ],
    },
    stack: [
      { key: 'C', text: 'Next.js 16, React 19, TypeScript 6, Tailwind 4, shadcn/ui, next-intl in English and Tagalog, MapLibre' },
      { key: 'S', text: 'Server actions, pnpm workspaces, Zod 4' },
      { key: 'D', text: 'Supabase Postgres 17 with row-level security, PostGIS and pg_cron; Supabase Storage' },
      { key: 'X', text: 'Supabase Auth, Cloudflare Turnstile, Resend' },
      { key: 'ship', text: 'Vitest, pgTAP, Playwright with axe, Lighthouse, staged releases to Vercel' },
    ],
    links: [{ label: 'askpinoy.com', href: 'https://askpinoy.com' }],
  },
  {
    id: 'rings',
    name: 'League Rings',
    role: 'Solo, end to end, live store',
    years: '2026',
    paras: [
      'Championship rings and league shirts for fantasy leagues. A shopper uploads a photo, sees their league artwork on a shirt, and orders it through Shopify.',
      'Anything that costs money is guarded twice: a rate limit sits in front of every paid image call, and the fulfilment script does a dry run unless I tell it otherwise.',
    ],
    figs: [],
    system: {
      title: 'League Rings',
      nodes: [
        { id: 'C1', label: 'Product page', sub: 'photo, canvas', lane: 0, row: 0 },
        { id: 'S1', label: 'Cloudflare Worker', sub: 'keys, rate limit', lane: 1, row: 0 },
        { id: 'A1', label: 'Image model', sub: 'preview, print', lane: 2, row: 0 },
        { id: 'D1', label: 'Workers KV', sub: '15-minute expiry', lane: 2, row: 1 },
        { id: 'X1', label: 'Shopify', sub: 'cart, checkout', lane: 0, row: 1 },
        { id: 'S2', label: 'Fulfilment script', sub: 'Python, dry run', lane: 1, row: 1 },
        { id: 'S3', label: 'Print-file builder', sub: 'Pillow', lane: 1, row: 2 },
        { id: 'X2', label: 'Printify', sub: 'order held', lane: 2, row: 2 },
      ],
      edges: [
        { from: 'C1', to: 'S1', kind: 'call', label: 'photo' },
        { from: 'S1', to: 'A1', kind: 'call', label: 'generate' },
        { from: 'S1', to: 'D1', kind: 'call', label: 'stash' },
        { from: 'C1', to: 'X1', kind: 'call', label: 'add to cart' },
        { from: 'X1', to: 'S2', kind: 'message', label: 'order' },
        { from: 'S2', to: 'S1', kind: 'call', label: 'print size' },
        { from: 'S2', to: 'S3', kind: 'call', label: 'lettering' },
        { from: 'S2', to: 'X2', kind: 'call', label: 'held order' },
      ],
    },
    flow: {
      title: 'A shirt, from photo to print',
      steps: [
        { kind: 'work', label: 'Upload', note: 'A shopper uploads a photo on the product page.', nodes: ['C1'] },
        { kind: 'check', label: 'Limit', note: 'The Worker checks the origin and a per-IP limit before any paid call.', nodes: ['S1'] },
        { kind: 'work', label: 'Preview', note: 'The image model returns a preview. Lettering is drawn in the browser.', nodes: ['S1', 'A1', 'D1', 'C1'] },
        { kind: 'work', label: 'Order', note: 'The artwork travels with the cart line through Shopify checkout.', nodes: ['C1', 'X1'] },
        { kind: 'check', label: 'Dry run', note: 'The script prints the order it would send, and sends nothing.', nodes: ['X1', 'S2'] },
        { kind: 'work', label: 'Print file', note: 'The art is regenerated at print size and the lettering composited.', nodes: ['S2', 'S1', 'S3'] },
        { kind: 'wait', label: 'Held', note: 'The print order is created on hold. I review it and release it by hand.', nodes: ['S2', 'X2'] },
      ],
    },
    stack: [
      { key: 'C', text: 'Shopify Liquid, plain JavaScript, Canvas' },
      { key: 'S', text: 'Cloudflare Workers, Python 3 with Pillow and NumPy' },
      { key: 'D', text: 'Workers KV' },
      { key: 'A', text: 'An image model API over HTTPS' },
      { key: 'X', text: 'Shopify, Printify' },
      { key: 'ship', text: 'Wrangler' },
    ],
    links: [{ label: 'leaguerings.com', href: 'https://leaguerings.com' }],
  },
]

/* ---------- Agents ---------- */

export const agents = {
  intro: [
    'I build with Claude Code every day and I treat it as a system to engineer. Each product has role subagents with scoped tools. I route models by job, hooks block a commit until the checks pass, skills run the repeatable work, and MCP servers give the agents read-only access to the database, deploys and error tracking.',
    'When a model says a task is done, that is a claim and not yet a result. Each rule below came from a real incident.',
  ],
  rules: [
    {
      rule: 'Check that the email was sent. "The job is deployed" is not evidence.',
      why: 'Every scheduled email job on one product had failed since launch, and the first fix was marked done when it was not.',
    },
    {
      rule: 'A document may say a check exists only if a test shows the check refusing.',
      why: 'I found seven places where tool-written docs described a safeguard that had never run.',
    },
    {
      rule: 'Only one role may write to the store, and it confirms which store first.',
      why: 'The connection once pointed at the wrong store.',
    },
    {
      rule: 'The tools do not deploy, change production data, send email or spend money.',
      why: 'Anything irreversible stays with a person.',
    },
  ],
  code: {
    path: 'immortal-drafts/.claude/settings.json',
    lines: [
      '"permissions": {',
      '  "deny": ["Read(./.env)", "Read(./.env.*)", "Read(./secrets/**)"],',
      '  "ask":  ["Bash(supabase db push *)", "Bash(vercel --prod *)"]',
      '},',
      '"hooks": {',
      '  "PreToolUse": [{',
      '    "matcher": "Bash",',
      '    "hooks": [{',
      '      "type": "command",',
      '      "if": "Bash(git commit *)",',
      '      "command": "… npm run -s typecheck && npm run -s check:content || exit 2"',
      '    }]',
      '  }]',
      '}',
    ],
    highlight: [11],
    note: 'Exit code 2 blocks the commit. This rule is enforced, not just written down.',
  },
  link: { label: 'How I check work I did not write', href: '/work/fixed-was-false' },
}

/* ---------- Capabilities ---------- */

export const capabilities: { asked: string; where: string; more?: string; link?: { label: string; href: string } }[] = [
  {
    asked: 'Agents and tool use',
    more: "He built a scheduler the model runs through tool calls. It became the product's agents.",
    where: 'Role-based agents with scheduled tasks, web monitoring and tool connectors, in production at',
    link: { label: 'Kuvai', href: '#kuvai' },
  },
  {
    asked: 'Context engineering, prompts and RAG',
    more: 'On the AI SDK since version 3, in July 2024.',
    where: 'Since GPT-3.5, when all three were daily pain. One of the first users of the AI SDK, at',
    link: { label: 'Kuvai', href: '#kuvai' },
  },
  {
    asked: 'Influence without authority',
    more: 'He convinced a CTO to change the stack. Ask him for the argument.',
    where: 'Convinced the CTO to move the product from Streamlit in Python to JavaScript, at',
    link: { label: 'Kuvai', href: '#kuvai' },
  },
  {
    asked: 'Communicating from front-line users to executives',
    more: 'Plant floor, executives, customers. He has worked with all three.',
    where: 'Front-line associates at Toyota and Amazon, the CTO and CEO at Kuvai, and paying customers on my own product. See',
    link: { label: 'above', href: '#range' },
  },
  {
    asked: 'Working directly with customers',
    more: 'He answers every support email. One refund became a tested rule.',
    where: 'Support, refunds and pricing for 537 paying accounts on',
    link: { label: 'Fantasy League Lottery', href: '#fll' },
  },
  {
    asked: 'End-to-end ownership',
    more: 'Four products, alone. From the idea to the support inbox.',
    where: 'Every side project is mine end to end: idea, design, code, pricing, launch and support. Spec to live in two days on',
    link: { label: 'Immortal Drafts', href: '#immortal' },
  },
  {
    asked: 'Privacy and sensitive data',
    more: 'Personal data is masked before a model ever sees it.',
    where: 'Personal information masked before a model call at Kuvai. Private rows and owner consent enforced by the database on',
    link: { label: 'AskPinoy', href: '#askpinoy' },
  },
  {
    asked: 'Testing and evaluation',
    more: '1,443 unit tests on one game, and a test that bans Math.random.',
    where: 'Deterministic replay, a purity test on the engine, and a scoring model tested once on a held-out year, on',
    link: { label: 'Immortal Drafts', href: '#immortal' },
  },
  {
    asked: 'AI coding tools, used well',
    more: 'Seventeen agents on one product. A hook blocks bad commits.',
    where: 'Subagents, hooks, skills and MCP servers every day, and an AI development pipeline for a whole team, where pull requests carry Playwright screenshots and videos as proof. See',
    link: { label: 'how I keep agents honest', href: '#agents' },
  },
]

/* ---------- Experience ---------- */

export const experience: { years: string; role: string; org: string; note?: string; more?: string }[] = [
  {
    years: '2024 – present',
    role: 'AI Engineer',
    org: 'Kuvai, Toronto',
    more: 'Joined pre-seed. Moved the product off Streamlit. Led the Mac and iPhone apps through App Store approval.',
  },
  {
    years: '2022 – present',
    role: 'Founder',
    org: 'Fantasy League Lottery, Toronto',
    more: '43,900 lotteries run. CA$11,000 earned. He wrote the core by hand and does everything himself.',
  },
  {
    years: '2023',
    role: 'IT Analyst, internship',
    org: 'York Region',
    note: 'Built a document question-and-answer chatbot for IT support.',
    more: 'An early one. Staff asked it IT questions and it answered from the documents.',
  },
  {
    years: '2021 – 2023',
    role: 'Business Data Analyst',
    org: 'JC Electrofields Power System, Manila',
    more: 'More than ten Excel and Power BI reports. His analysis cut costs by 5%.',
  },
  {
    years: '2020 – 2021',
    role: 'Area Manager',
    org: 'Amazon, Toronto',
    note: 'Wrote an automation script that cut a manager\'s report from 2 hours to 5 minutes, used by area managers across Canada.',
    more: 'He ran Canada\'s top same-day station: 3,500 packages a day. Then he automated the paperwork.',
  },
  {
    years: '2016 – 2018',
    role: 'Engineering internships',
    org: 'Toyota Motor Manufacturing Canada, TTC, York Region, Loblaw, Clearbridge Mobile',
    note: 'At Toyota, designed parts that made it possible to manufacture every RAV4 built in Canada, working with Toyota engineers across North America. Also subway reliability, fleet analysis, supply chain and mobile QA.',
    more: 'Five co-op terms. At the TTC he ended a recurring subway-door failure. At Loblaw he cut manual orders 17%.',
  },
  {
    years: '2023',
    role: 'Postgraduate certificate, Applied A.I. Solutions Development',
    org: 'George Brown College',
    more: 'Dean\'s List. He went back to school for AI before it was the obvious move.',
  },
  {
    years: '2014 – 2019',
    role: 'BASc, Management Engineering',
    org: 'University of Waterloo',
    more: 'Industrial engineering by another name. He looks for the bottleneck first.',
  },
]

export const closing = 'Happy to talk about agents, AI products, or anything on this page.'

export const figuresNote =
  'Numbers come from my own Stripe, PayPal, analytics and database reports, or from counts in the code, each with its date.'
