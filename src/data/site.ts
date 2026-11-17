// Single source of truth for all site content.
// Every number carries its window and where it came from. If a number changes,
// change it here and keep the date honest.

export const person = {
  name: 'Ramuel Batuigas',
  location: 'Toronto',
  email: 'rjbatuigas@gmail.com',
  linkedin: 'https://linkedin.com/in/rjbatuigas',
  github: 'https://github.com/ManagementEngineer',
  resume: '/resume.pdf',
}

export const opening = {
  headline: 'AI engineer. I build agent products end to end and make them hold up with real users.',
  ask: 'Founding engineer at Kuvai. Based in Toronto.',
  letter: [
    "I'm Ramuel, founding engineer at Kuvai, where businesses build their own team of AI teammates. I helped decide the tech stack and build the product, and I wear several hats, from engineering to product. The platform runs agents that hold a role, run tasks on a schedule, monitor the web and extract data from documents, on a model layer that works across OpenAI, Anthropic and Google.",
    "What I care about most is making model output something a business can rely on. At Kuvai that meant masking personal information before any document reaches a model. On my own products it meant learning that a model saying \"done\" is a claim, and building checks that confirm the outcome.",
    "I also know when AI is the wrong answer. I run Fantasy League Lottery, which grew from 238 registered accounts to 3,835 in its first paid season. I shipped ten LLM tools on it, measured them, and cut them six weeks later when nobody used them.",
    "Before software I studied management engineering at Waterloo and ran Amazon's top same-day delivery station in Canada. That's where the habit of measuring everything comes from.",
  ],
  proofs: [
    {
      value: 'Founding engineer',
      label: 'At Kuvai, an AI-teammates platform. I helped decide the tech stack and build the product, across engineering and product.',
    },
    {
      value: '3 providers',
      label: 'One model layer across OpenAI, Anthropic and Google, with a Python engine behind a message queue and results streamed to the browser.',
    },
    {
      value: '238 to 3,835',
      label: 'Registered accounts on my own product in its first paid season, Feb to Sep 2026. 14% of them paid.',
    },
  ],
}

/* ---------- Work ---------- */

export type Lane = 'shipped' | 'measured' | 'held' | 'killed' | 'reversed'

export const lanes: { id: Lane; label: string; means: string }[] = [
  { id: 'shipped', label: 'Shipped', means: 'built and released' },
  { id: 'measured', label: 'Measured', means: 'read the data or graded a prediction' },
  { id: 'held', label: 'Held', means: 'frozen or waiting on a gate' },
  { id: 'killed', label: 'Killed', means: 'removed or shelved' },
  { id: 'reversed', label: 'Reversed', means: 'changed position on an earlier call' },
]

export type Source = 'my own reports' | 'git history' | 'repo docs' | 'live site'

export type Fig = {
  value: string
  window: string
  source: Source
}

export type Work = {
  id: string
  name: string
  status: string
  years: string
  url: string
  urlLabel: string
  paras: string[]
  built?: { label: string; text: string }[]
  fig?: Fig
  caseHref?: string
  caseLabel?: string
  shot: string
  shotAlt: string
}

export const work: Work[] = [
  {
    id: 'kuvai',
    name: 'Kuvai',
    status: 'Founding engineer',
    years: '2024 to now',
    url: 'https://kuvai.com',
    urlLabel: 'kuvai.com',
    paras: [
      'Kuvai lets a business build a team of AI teammates, such as an assistant, a bookkeeper or a research analyst. You give each one a role, instructions and your documents, and it chats, runs tasks on a schedule, watches the web and pulls data out of files. It runs on web, Mac and iPhone.',
      "I'm the founding engineer. I helped decide the tech stack and build the product, and I wear several hats, from engineering to product: working out what the next version has to do, then building it. These are the parts of the platform I've worked on.",
    ],
    built: [
      { label: 'Agents', text: 'Teammates with a role, instructions, duties, conversation history and usage metering.' },
      { label: 'Orchestration', text: 'A web app decoupled from a Python AI engine by a message queue, with a WebSocket bridge that streams results back to the browser.' },
      { label: 'Model layer', text: 'Provider-agnostic, across OpenAI, Anthropic and Google, so no feature depends on one vendor.' },
      { label: 'Automation', text: 'Scheduled and recurring tasks, and agents that monitor web sources and report changes.' },
      { label: 'Documents', text: 'Extraction agents covered by snapshot tests, plus knowledge upload and vectorization for retrieval.' },
      { label: 'Privacy', text: 'Detection and masking of personal information before any document reaches a model, with the masking status shown to the user. For customers in regulated work like insurance, that decides whether they can use the product at all.' },
      { label: 'Platform', text: 'Third-party tool connectors, a credits ledger with Stripe billing, auth, rate limiting, and CI that ships Docker images to AWS.' },
    ],
    shot: '/shots/kuvai.jpg',
    shotAlt: 'Kuvai home page showing a team of AI teammates',
  },
  {
    id: 'fll',
    name: 'Fantasy League Lottery',
    status: 'Founder and sole operator',
    years: '2022 to now',
    url: 'https://www.fantasyleaguelottery.com',
    urlLabel: 'fantasyleaguelottery.com',
    paras: [
      'Every fantasy league has to decide who drafts first, and it usually ends in an argument. Fantasy League Lottery lets a commissioner set the odds, seal the draw, and reveal it to the whole league as a live show. Every draw comes with a receipt anyone can check, so nobody can say it was rigged. More than 43,900 lotteries have been run on it.',
      'I run all of it: product, design, engineering, pricing and support. In its first paid season it brought in $7,724, and August alone was $3,917 from 336 payments.',
    ],
    built: [
      { label: 'LLM features', text: 'Answers grounded in a league\'s own rule book, dispute rulings and schedule recommendations on the Claude API, metered by a transactional credit ledger with rate limits and daily caps.' },
      { label: 'Fairness proof', text: 'A SHA-256 commit-and-reveal on every draw: the hash is published before the reveal and the inputs after.' },
      { label: 'Deterministic reveals', text: '3D shows rebuilt from a seed on each device, so a whole league sees the same thing without a stored script.' },
      { label: 'Payments and quality', text: 'Stripe and PayPal with idempotent webhooks, about 418 tests, and CI.' },
    ],
    fig: {
      value: '14% paid',
      window: '537 of 3,835 registered accounts, by Sep 4, 2026',
      source: 'my own reports',
    },
    caseHref: '/work/what-sells',
    caseLabel: 'How I found what people pay for',
    shot: '/shots/fll.jpg',
    shotAlt: 'Fantasy League Lottery home page',
  },
  {
    id: 'immortal',
    name: 'Immortal Drafts',
    status: 'Solo project, live and free',
    years: '2026',
    url: 'https://immortaldrafts.com',
    urlLabel: 'immortaldrafts.com',
    paras: [
      "A free browser game for esports fans who follow the pro scene more than they play. You draft a team from historic pro rosters across five titles and watch it play through the tournament. I built it to test how fast I could take an idea to real players: it went live two days after I wrote the spec.",
    ],
    built: [
      { label: 'Simulation', text: 'Deterministic and identical in the browser and on the server, so the server can replay any draft and refuse a result the seed never produced.' },
      { label: 'Evaluation', text: 'A pick-scoring model fitted on five years of tournament data, with the weights committed before a single test on a held-out year.' },
    ],
    fig: {
      value: '2,398 players',
      window: 'first four days, from Nov 1, 2026',
      source: 'my own reports',
    },
    shot: '/shots/immortal.jpg',
    shotAlt: 'Immortal Drafts home page with five esports titles',
  },
]

export const alsoBuilding = [
  {
    name: 'League Rings',
    url: 'https://leaguerings.com',
    note: 'Championship rings and league merch for fantasy leagues, on Shopify. I wrote the unit economics and the go or no-go gates before spending anything.',
  },
  {
    name: 'AskPinoy',
    url: 'https://askpinoy.com',
    note: 'A directory of Filipino-owned businesses in Toronto and the GTA, for the question people keep asking Facebook groups. Built and pre-launch: it opens once 60 businesses are listed.',
  },
]

export const figuresNote =
  'Numbers come from my own Stripe, PayPal, analytics and database reports, each with its date. Revenue is gross, in US dollars.'

/* ---------- Decisions shown on the home page ---------- */

export const decisions = [
  {
    title: 'I stopped trusting "done".',
    saw: 'Three days before peak season I checked one email by looking for the actual send. Every scheduled email job had been silently failing, and the first fix was marked done when it was not.',
    did: 'I fixed four stacked bugs, added a guard so stale records could never be emailed, and changed how I verify work: by the outcome, never by the deploy.',
    result: 'The product sent its first 330 emails, and the rule now applies to everything I build with AI tools.',
    href: '/work/fixed-was-false',
  },
  {
    title: 'I cut ten AI tools nobody used.',
    saw: 'I shipped ten tools in six weeks, most of them on the Claude API, and gave 418 users free credits. None were spent.',
    did: 'I retired the plan, deleted the biggest tool, and put the time back into the core product before peak season.',
    result: 'I now set the usage bar and the date before I build the second version of anything.',
    href: '/work/ai-credits',
  },
  {
    title: 'I priced what people were already reaching for.',
    saw: 'Big leagues and commissioners with custom draft rules kept running into the limits of the free version.',
    did: 'I put leagues of 13 or more teams, and those features, behind the paid tier.',
    result:
      'Sign-up to paid went from 5.6% to 12.9% in the two weeks after. It is a small sample with no control group, but it held: 14% of accounts had paid by September.',
    href: '/work/what-sells',
  },
  {
    title: 'I stopped selling my favourite feature.',
    saw: '64 people watched a preview of the 3D reveal shows. None of them started a checkout. My paywall data said people bought to get past a limit that was blocking them that night.',
    did: 'I rewrote the peak-season pitch around those limits and kept the 3D shows as the thing leagues share.',
    result: 'August brought in $3,917 from 336 payments, and 31% of checkout starts completed.',
    href: '/work/what-sells',
  },
]

/* ---------- The log ---------- */

export type Prediction = {
  called: string
  calledOn: string
  result?: string
  resultOn?: string
  grade: 'hit' | 'missed high' | 'missed low' | 'open'
  reviewOn?: string
}

export type Entry = {
  id: string
  date: string // YYYY-MM-DD, or YYYY-MM when the day is not on record
  lane: Lane
  product: string
  headline: string
  detail: string
  source: string
  supersedes?: string
  reversedBy?: string
  prediction?: Prediction
  featured?: boolean
}

const FLL = 'Fantasy League Lottery'
const ID = 'Immortal Drafts'
const AP = 'AskPinoy'
const LR = 'League Rings'
const KV = 'Kuvai'

export const log: Entry[] = [
  {
    id: 'fll-first-build',
    date: '2022-05-10',
    lane: 'shipped',
    product: FLL,
    headline: 'Started a draft-lottery tool for fantasy leagues.',
    detail:
      'Sixty-five commits over six weeks, then nothing for three and a half years. The tool stayed online and free. About 33,600 lotteries were run on it before I touched it again.',
    source: 'git history; roadmap',
  },
  {
    id: 'kuvai-v1',
    date: '2024-07',
    lane: 'shipped',
    product: KV,
    headline: 'Started on the first version of the Kuvai product as founding engineer.',
    detail:
      'I helped decide the tech stack and build the product, wearing several hats from engineering to product.',
    source: 'git history',
  },
  {
    id: 'kuvai-pii',
    date: '2024-10',
    lane: 'shipped',
    product: KV,
    headline: 'Masked personal information before documents reach a model.',
    detail:
      'Added detection and masking of personal information with Microsoft Presidio, and showed users the masking status of each document.',
    source: 'git history',
  },
  {
    id: 'kuvai-v2',
    date: '2024-12',
    lane: 'shipped',
    product: KV,
    headline: 'Work began on the second-generation platform.',
    detail:
      'I have worked on scheduling, document extraction, billing and credits, web monitoring, and the pipeline that ships it, and I am still on it.',
    source: 'git history',
  },
  {
    id: 'fll-rebuild',
    date: '2026-02-27',
    lane: 'shipped',
    product: FLL,
    headline: 'Rebuilt the lottery in four days and added a paid tier.',
    detail:
      'February 24 to 27, with Claude Code. New framework, accounts, rate limits, tests, funnel events and the first paid limit. Stripe rejected the account that week, so PayPal checkout went live the same day. Stripe approved on re-review in April.',
    source: 'git history; roadmap',
    featured: true,
  },
  {
    id: 'fll-denominator',
    date: '2026-04-09',
    lane: 'measured',
    product: FLL,
    headline: 'Registration rate was 9.4%, not 0.7%. I had the wrong denominator.',
    detail:
      'I had been dividing sign-ups by every visitor instead of by people who reached the sign-in step. A later check found raw lottery counts overstated distinct leagues 2.4 times because of re-runs. The report now prints distinct leagues.',
    source: 'roadmap, Apr 9 entry',
  },
  {
    id: 'fll-proof-cut',
    date: '2026-04-10',
    lane: 'killed',
    product: FLL,
    headline: 'Cut the fairness proof. No user had asked for one.',
    detail:
      'I deferred it once and cut it once, both times because nobody had requested it. That was the wrong test.',
    source: 'roadmap, Apr 10 entry',
    reversedBy: 'fll-proof-shipped',
    featured: true,
  },
  {
    id: 'fll-13-gate',
    date: '2026-04-15',
    lane: 'shipped',
    product: FLL,
    headline: 'Put leagues of 13 or more teams behind the paid tier.',
    detail:
      'Sign-up to paid went from 5.6% in the two weeks before to 12.9% in the two weeks after. That is 9 buyers against 20 with no control group, so I treat it as a strong hint and not as proof.',
    source: 'my own reports, Apr 30',
  },
  {
    id: 'fll-live-reveal',
    date: '2026-04-29',
    lane: 'killed',
    product: FLL,
    headline: 'Removed Live Reveal 17 days after shipping it.',
    detail: 'Shipped April 12 as a beta. Switched off, then deleted.',
    source: 'git history',
  },
  {
    id: 'fll-ten-tools',
    date: '2026-04-30',
    lane: 'shipped',
    product: FLL,
    headline: 'Ten extra tools in about six weeks, most of them AI.',
    detail:
      'Trade Analyzer, Rule Book Q&A, dispute rulings, Roster Analyzer, Start/Sit, a tarot reading and others, with a credit system. The roadmap had a pillar for it: AI tools as the way to win new players. The date here is the end of the run, not one release.',
    source: 'git history; roadmap',
    featured: true,
  },
  {
    id: 'fll-tarot',
    date: '2026-05-09',
    lane: 'killed',
    product: FLL,
    headline: 'Killed the tarot draft reading. Two readings in five weeks.',
    detail: 'The first of the ten tools to go.',
    source: 'roadmap',
  },
  {
    id: 'fll-credits-read',
    date: '2026-05-25',
    lane: 'measured',
    product: FLL,
    headline: '418 people were given free AI credits. None were spent.',
    detail:
      'Three free credits each. Meanwhile 96.9% of active Pro users were using the lottery itself.',
    source: 'roadmap, May 25 entry',
    featured: true,
  },
  {
    id: 'fll-ai-retired',
    date: '2026-05-25',
    lane: 'killed',
    product: FLL,
    headline: 'Retired the AI tools plan and deleted the Trade Analyzer.',
    detail:
      'Route, API, model, tests and dependencies removed, with a redirect. I also cancelled the work to help users find the tools. There was no point building discovery for features I was removing. Cost: about six weeks.',
    source: 'roadmap, May 25 entry; commit 73f5e92',
    featured: true,
  },
  {
    id: 'fll-freeze',
    date: '2026-05-25',
    lane: 'held',
    product: FLL,
    headline: 'Froze feature work until two reads came in.',
    detail:
      'No new features until both reads had landed, with dates and a keep-or-kill threshold written down first.',
    source: 'roadmap, May 25 entry',
  },
  {
    id: 'fll-3d',
    date: '2026-06-12',
    lane: 'shipped',
    product: FLL,
    headline: 'Shipped two 3D reveal shows and led the paid pitch with them.',
    detail:
      'The Vault and The Brawl. The Brawl stores no script. Each viewer rebuilds the show from a seed, so the whole league sees the same fight. It is the deepest engineering in the product.',
    source: 'git history',
    reversedBy: 'fll-3d-demoted',
    featured: true,
  },
  {
    id: 'fll-targets',
    date: '2026-06-27',
    lane: 'measured',
    product: FLL,
    headline: 'Passed the first revenue target and set a commit and a stretch for the season.',
    detail:
      'I had never run a paid August, so I set two numbers instead of one forecast and graded them afterward.',
    source: 'roadmap, Jun 27 entry',
    prediction: {
      called: '$5,000 commit, $7,000 stretch, lifetime',
      calledOn: '2026-06-27',
      result: 'commit passed about Aug 30, stretch about Sep 17',
      resultOn: '2026-09-17',
      grade: 'hit',
    },
  },
  {
    id: 'fll-proof-shipped',
    date: '2026-07-07',
    lane: 'reversed',
    product: FLL,
    headline: 'Shipped a fairness proof on every draw.',
    detail:
      'Nobody asks for proof before a dispute. They ask after. Each draw now publishes a SHA-256 hash before the reveal and the inputs after, so anyone can check it.',
    source: 'commit 57b33c6',
    supersedes: 'fll-proof-cut',
    featured: true,
  },
  {
    id: 'fll-august-forecast',
    date: '2026-07-07',
    lane: 'measured',
    product: FLL,
    headline: 'Forecast August revenue. I was too high.',
    detail: 'My week-by-week forecast overshot the month, and my estimate of the September drop was three to ten times too pessimistic.',
    source: 'app sweep, Jul 7; my own reports',
    prediction: {
      called: '$4.5k to $6.8k for August',
      calledOn: '2026-07-07',
      result: '$3,917 from 336 payments',
      resultOn: '2026-08-31',
      grade: 'missed high',
    },
    featured: true,
  },
  {
    id: 'fll-3d-demoted',
    date: '2026-07-16',
    lane: 'reversed',
    product: FLL,
    headline: 'Stopped selling the 3D reveals. 64 preview viewers, 0 checkout starts.',
    detail:
      'People were paying to get past limits that blocked a job: custom draft rules, scheduled pick drops, big leagues. I rewrote the August pitch around those and kept the 3D shows as the thing people share.',
    source: 'roadmap, Jul 16 entry',
    supersedes: 'fll-3d',
    featured: true,
  },
  {
    id: 'fll-price-test',
    date: '2026-07-16',
    lane: 'killed',
    product: FLL,
    headline: 'Cancelled a price test to protect another read.',
    detail:
      'I had planned to test $24.99 against $19.99 a year, with a kill rule written in advance. A win-back email campaign was running at the same time and would have muddied both. I kept the win-back. It converted 2 of 410. I still do not know if $24.99 works.',
    source: 'roadmap, Jul 16 entry',
  },
  {
    id: 'fll-crons-found',
    date: '2026-07-28',
    lane: 'measured',
    product: FLL,
    headline: 'Every scheduled email job had failed on every run since launch.',
    detail:
      'Three days before peak season I checked one win-back email by looking for the actual send. It had not gone. All four jobs were being rejected over a secret the documentation said was created automatically.',
    source: 'incident note, Jul 28',
    featured: true,
  },
  {
    id: 'fll-crons-false-fix',
    date: '2026-07-29',
    lane: 'shipped',
    product: FLL,
    headline: 'Marked the email jobs fixed.',
    detail:
      'The note said resolved. Three more bugs sat behind the first: a date compared against text that silently matched nothing, a missing database index, and an index sorted the wrong way.',
    source: 'incident note, Jul 29',
    reversedBy: 'fll-crons-real-fix',
    featured: true,
  },
  {
    id: 'fll-crons-real-fix',
    date: '2026-08-02',
    lane: 'reversed',
    product: FLL,
    headline: 'Reopened the fix after reproducing the failure live. 330 first-ever emails went out.',
    detail:
      'Added a seven-day freshness guard so a backlog of about 5,500 stale records could never be sent to real people. I threw out every earlier conclusion drawn from email data. New rule: verify by sends, never by the deploy.',
    source: 'commit 1c3a183',
    supersedes: 'fll-crons-false-fix',
    featured: true,
  },
  {
    id: 'fll-spoiler',
    date: '2026-08-05',
    lane: 'shipped',
    product: FLL,
    headline: 'A refund became a rule: nothing visible before a reveal may link a team to a pick.',
    detail:
      'A paying customer noticed the roulette screen listed teams in draft order before the first spin. I checked every reveal mode, found four more leaks, and added tests that fail if the fix is removed.',
    source: 'git history; audit check 21',
  },
  {
    id: 'fll-attribution',
    date: '2026-08-13',
    lane: 'measured',
    product: FLL,
    headline: 'An event field named "source" had been corrupting 24% of session attribution.',
    detail:
      'Found by asking why email showed zero sessions. Every analytics channel figure before this date is unreliable, and I mark it that way.',
    source: 'incident note, Aug 13',
  },
  {
    id: 'lr-shirts',
    date: '2026-08-20',
    lane: 'killed',
    product: LR,
    headline: 'Built a custom shirt line of nine products and deleted it the same day.',
    detail: 'I left a note in the docs so nobody, including me, builds it again without a reason.',
    source: 'repo docs',
  },
  {
    id: 'ap-scope-cut',
    date: '2026-09-25',
    lane: 'held',
    product: AP,
    headline: 'Cut the first phase from roughly two products to one loop.',
    detail:
      'Deferred the map, "near me", favourites, the stats chart, the mobile app and more. Every cut item has a written condition for coming back.',
    source: 'decision record 0019',
  },
  {
    id: 'ap-licence',
    date: '2026-09-29',
    lane: 'reversed',
    product: AP,
    headline: 'Reversed a licence check on regulated trades: list broadly, badge narrowly.',
    detail:
      'Building the check showed me its cost. Listings now publish with a line telling the reader what licence to ask for, and the verified check becomes a badge. Immigration consultants stay behind a hard gate. The argument against this is kept on file.',
    source: 'decision record 0027',
  },
  {
    id: 'fll-october',
    date: '2026-10-15',
    lane: 'measured',
    product: FLL,
    headline: 'Three repeat buyers, ever, out of 477.',
    detail:
      'A commissioner buys once a year. Lifetime revenue reached $7,724 gross. My own plan calls this a $10,000 to $15,000 a year product near its ceiling, and I have no fix for that yet.',
    source: 'my own reports, Oct 15',
  },
  {
    id: 'ap-false-gates',
    date: '2026-10',
    lane: 'measured',
    product: AP,
    headline: 'Found seven places where the docs described a safeguard that had never run.',
    detail:
      'One quality check "had never passed". New rule: a document may say a check exists only when there is a test that shows the check refusing.',
    source: 'decision record 0038',
  },
  {
    id: 'ap-launch-gate',
    date: '2026-10-22',
    lane: 'held',
    product: AP,
    headline: 'Holding the launch until 60 listings are published and 10 are claimed.',
    detail: 'The site is built and deployed. Published listings on this date: 0.',
    source: 'phase 1 plan, Oct 22',
  },
  {
    id: 'id-live',
    date: '2026-10-29',
    lane: 'shipped',
    product: ID,
    headline: 'Immortal Drafts live, two days after the spec.',
    detail: 'Built with Claude Code. Launched publicly on November 1 through two Reddit posts.',
    source: 'git history',
  },
  {
    id: 'ap-consent',
    date: '2026-10-31',
    lane: 'shipped',
    product: AP,
    headline: 'Made the database refuse any listing its owner has not confirmed.',
    detail:
      'The site promised owners we would confirm details before listing them, and the system did not enforce it. A home baker should not find herself listed without saying yes. Cost: about one more hour of my time a week.',
    source: 'decision record 0046',
  },
  {
    id: 'id-study',
    date: '2026-11-05',
    lane: 'killed',
    product: ID,
    headline: 'Wrote a study for a new game mode and withdrew it the same evening.',
    detail: 'It was not a good game. The study is kept for the record. Nothing was built.',
    source: 'decisions file',
  },
  {
    id: 'id-difficulty',
    date: '2026-11-06',
    lane: 'shipped',
    product: ID,
    headline: 'Bounded the daily game after win rates ran from 0% to 64.9% in launch week.',
    detail: 'Found the cause in one table and shipped the fix the same afternoon, with a prediction logged before the result.',
    source: 'scorecard',
    prediction: {
      called: 'every game-day between 5% and 35%',
      calledOn: '2026-11-06',
      grade: 'open',
      reviewOn: '2026-11-21',
    },
  },
  {
    id: 'id-handoff',
    date: '2026-11-09',
    lane: 'measured',
    product: ID,
    headline: 'A change that moved the wrong number.',
    detail:
      'Players who started with the daily game came back about three times as often, so I steered new players into it. Daily reach on day one went from 16% to between 72% and 94%. Next-day return went from 5.3% to 4.5% (37 of 826), which is no change. The first group was choosing themselves.',
    source: 'metrics file, Nov 9',
    featured: true,
  },
]

/* ---------- How I work ---------- */

export const howIWork = {
  intro: [
    "I build with Claude Code every day and I treat it as a system to engineer, not a chat window. Each product has role subagents with scoped tools, and I route models by job: a stronger model for decisions and review, a cheaper one for narrow checks. Hooks block a commit until the type check and content check pass. Custom skills and slash commands run the repeatable work, and MCP servers give the agents read-only access to the database, deploys and error tracking.",
    "Models fail in a particular way: confident, plausible and unchecked. So I treat every \"done\" from a model as a claim until something I can observe confirms it. These are the rules my agents run under. Each one came from a real incident.",
  ],
  rules: [
    {
      rule: 'Check that the email was sent. "The job is deployed" is not evidence.',
      why: 'Every scheduled email job on one product had failed since launch, and the first fix was marked done when it was not.',
    },
    {
      rule: 'A document may say a check exists only if there is a test that shows the check refusing.',
      why: 'I found seven places where tool-written docs described a safeguard that had never run.',
    },
    {
      rule: 'Only one role may write to the store, and it confirms which store it is connected to first.',
      why: 'The connection once pointed at the wrong store.',
    },
    {
      rule: 'The tools do not deploy, change production data, send email or spend money. I do those.',
      why: 'Anything irreversible stays with a person.',
    },
    {
      rule: 'Say "I don\'t know". Mark anything unverified.',
      why: 'Models state guesses about prices, laws and vendor terms as facts.',
    },
  ],
}

export const stack = [
  { label: 'AI', text: 'Claude API, OpenAI API, Vercel AI SDK, Claude Code (subagents, hooks, skills, MCP), Microsoft Presidio, document extraction, vector retrieval' },
  { label: 'Build', text: 'TypeScript, Python, Next.js, React, Bun, Node' },
  { label: 'Data', text: 'MongoDB, Postgres (Supabase), Firestore, MySQL' },
  { label: 'Ship', text: 'AWS (ECR, S3), Docker, Vercel, GitHub Actions, message queues, WebSockets, Stripe, Auth0' },
]

/* ---------- Experience ---------- */

export const history = [
  {
    years: '2024 to now',
    role: 'Founding Engineer, AI & Product',
    org: 'Kuvai, Toronto',
    note: 'Helped decide the tech stack and build an AI-teammates platform, across engineering and product.',
  },
  {
    years: '2022 to now',
    role: 'Founder and sole operator',
    org: 'Fantasy League Lottery, Toronto',
    note: '',
  },
  {
    years: '2021 to 2023',
    role: 'Business Data Analyst',
    org: 'JC Electrofields Power System, Manila',
    note: 'Reporting and cost analysis for a power systems company.',
  },
  {
    years: '2020 to 2021',
    role: 'Area Manager',
    org: 'Amazon, Toronto',
    note: "Ran Canada's top Prime same-day delivery station: 3,500 packages a day at 98.85% success. We cut the steps a package went through by half and raised capacity 21%, about 134,000 more same-day packages a year. I wrote a small tool that cut the daily report from 45 minutes to 3, and other Canadian stations adopted it.",
  },
  {
    years: '2023',
    role: 'Postgraduate certificate, Applied A.I. Solutions Development',
    org: 'George Brown College',
    note: '',
  },
  {
    years: '2014 to 2019',
    role: 'BASc, Management Engineering',
    org: 'University of Waterloo',
    note: "Industrial engineering by another name. It's why I look for the bottleneck first.",
  },
]

/* ---------- Dropped ---------- */

export const madeNote =
  'I built this site with Claude Code. If you find a number that looks wrong, tell me and I will correct it.'

/* ---------- Case studies ---------- */

export type CaseSection = {
  heading: string
  paras: string[]
  receipt?: { date: string; value: string; window: string; source: string }
}

export type CaseStudy = {
  slug: string
  product: string
  title: string
  facts: { label: string; value: string }[]
  sections: CaseSection[]
  entries: string[]
}

export const cases: CaseStudy[] = [
  {
    slug: 'ai-credits',
    product: FLL,
    title: 'I shipped ten AI tools, measured them, and cut them six weeks later.',
    facts: [
      { label: 'Role', value: 'Sole operator' },
      { label: 'Dates', value: 'April to May 2026' },
      { label: 'Question', value: 'Do commissioners want AI tools from the site where they run their draft lottery?' },
    ],
    sections: [
      {
        heading: 'What I built',
        paras: [
          'In about six weeks I shipped ten tools on top of the lottery. Most were backed by the Claude API: a trade analyzer, questions answered from a league rule book, dispute rulings, a roster analyzer, start or sit advice, a tarot reading for your draft. I added a credit system to meter them. My roadmap had a pillar for all of it. AI tools were going to be how new players found the site.',
        ],
        receipt: { date: '2026-04-30', value: '10 tools', window: 'about six weeks, to end of April 2026', source: 'git history' },
      },
      {
        heading: 'The number',
        paras: [
          'I gave 418 users three free credits each. By May 25, none had been spent. The tarot reading had been used twice in five weeks.',
          'In the same data, 96.9% of active Pro users were using the lottery itself. The product people wanted was the one I already had.',
        ],
        receipt: { date: '2026-05-25', value: '0 of 418', window: 'free credits spent, to May 25, 2026', source: 'roadmap, May 25 entry' },
      },
      {
        heading: 'The call',
        paras: [
          'On May 25 I retired the pillar. I deleted the Trade Analyzer end to end: the page, the API, the model code, the tests and the dependencies, with a redirect left behind. I had planned work to help people find the tools, and I cancelled it. There was no point building discovery for features I was removing. Then I froze feature work until two reads came in, and went back to the lottery.',
        ],
        receipt: { date: '2026-05-25', value: 'Deleted', window: 'Trade Analyzer, commit 73f5e92', source: 'git history' },
      },
      {
        heading: 'What it did not prove',
        paras: [
          'Lifetime revenue was about $619 on May 25 and $7,724 on October 15. I do not credit the kill for that. August is about 80% of the year in this business, so most of the growth is the season. The claim is narrower: I stopped spending time on something with zero use before the one month that mattered.',
          'Three small AI features are still in the product: rulings, rule-book questions and schedule suggestions. They see almost no use, and nothing checks their answers.',
        ],
      },
      {
        heading: 'What I would do differently',
        paras: [
          'Ship one tool with a usage bar and a date before building the second. Write the kill number in advance, as I later did for a price test. And either remove the last three AI features or give them a test set.',
        ],
      },
    ],
    entries: ['fll-ten-tools', 'fll-tarot', 'fll-credits-read', 'fll-ai-retired', 'fll-freeze'],
  },
  {
    slug: 'what-sells',
    product: FLL,
    title: "Customers weren't paying for my best feature. Here is what they were paying for.",
    facts: [
      { label: 'Role', value: 'Sole operator' },
      { label: 'Dates', value: 'April to August 2026' },
      { label: 'Question', value: 'What do commissioners actually pay for?' },
    ],
    sections: [
      {
        heading: 'What I built',
        paras: [
          'In June I built three 3D reveal shows for the draft lottery. They are the deepest engineering in the product. One of them, The Brawl, stores no script at all. Each viewer rebuilds the show from a seed, so a whole league watching on different phones sees the same fight. I led the paid pitch with them.',
        ],
      },
      {
        heading: 'The number',
        paras: [
          '64 people watched a preview. None started a checkout. I fixed the button and tried again: one start, no purchases, over nine days.',
          'I had been recording why each person hit the paywall. Custom draft rules and scheduled pick drops accounted for 16 paywall opens each. League size accounted for 1. People were not paying for the show. They were paying to get past a limit that blocked something they needed to do that night.',
          'I had seen this once already. In April I put leagues of 13 or more teams behind the paid tier, and sign-up to paid went from 5.6% to 12.9%. That is 9 buyers against 20, two weeks each side, no control group. A hint, but it pointed the same way.',
        ],
        receipt: { date: '2026-07-16', value: '0 of 64', window: 'preview viewers who started checkout, to Jul 16, 2026', source: 'roadmap, Jul 16 entry' },
      },
      {
        heading: 'The call',
        paras: [
          'On July 16 I moved the 3D reveals out of the sales pitch. They became the thing people share. I rewrote the August pitch around the limits.',
          'August brought $3,917 from 336 payments, and 371 of 1,182 checkout starts completed. There is no control group here either. August is the season plus the pitch, and I cannot separate them. My own July forecast for the month was $4.5k to $6.8k, so I was too high.',
        ],
        receipt: { date: '2026-08-31', value: '$3,917', window: 'gross, August 2026, 336 payments', source: 'my own reports' },
      },
      {
        heading: 'A second miss in the same story',
        paras: [
          'A paying customer asked for a refund because the roulette screen listed teams in draft order before the first spin. I wrote it down as a rule: nothing visible before a reveal may link a team to a pick. Then I checked every reveal mode, found four more leaks, and added tests that fail if the fix is removed.',
        ],
        receipt: { date: '2026-08-05', value: '4 more leaks', window: 'found after one refund, Aug 2026', source: 'git history' },
      },
      {
        heading: 'What I would do differently',
        paras: [
          'Record why each person hits the paywall from the first day of charging, before building anything big. Put a rough 3D reveal in front of ten commissioners before spending two weeks on it.',
          'I still have no fix for the real ceiling. A commissioner buys once a year. Out of 477 buyers, three have ever bought twice.',
        ],
      },
    ],
    entries: ['fll-13-gate', 'fll-3d', 'fll-august-forecast', 'fll-3d-demoted', 'fll-price-test', 'fll-spoiler', 'fll-october'],
  },
  {
    slug: 'fixed-was-false',
    product: 'Fantasy League Lottery and AskPinoy',
    title: 'How I check work I did not write.',
    facts: [
      { label: 'Role', value: 'Sole operator' },
      { label: 'Dates', value: 'July to October 2026' },
      { label: 'Question', value: 'When AI tools write most of the code and the documents, how do I know what is true?' },
    ],
    sections: [
      {
        heading: 'What I found',
        paras: [
          'Three days before peak season I checked one win-back email by looking for the actual send. It had not gone.',
          'All four scheduled jobs on Fantasy League Lottery had been rejected on every run since launch, over a secret the documentation said was created automatically. Behind that sat three more bugs: a date compared against text that silently matched nothing, a missing database index, and an index sorted the wrong way.',
        ],
        receipt: { date: '2026-07-28', value: '4 of 4', window: 'scheduled jobs failing, launch to Jul 28, 2026', source: 'incident note' },
      },
      {
        heading: 'The false fix',
        paras: [
          'The note from July 29 said "resolved". It was not. I reproduced the failure live on August 2 and reopened it.',
          'After the real fix, 330 reveal emails went out. They were the first the product had ever sent. I added a seven-day freshness guard so a backlog of about 5,500 stale records could never reach real people.',
          'Then I threw out every earlier conclusion drawn from email data, including my own read that email capture was dead. Months of decisions had rested on jobs that never ran.',
        ],
        receipt: { date: '2026-08-02', value: '330 emails', window: 'first ever sent, after the Aug 2, 2026 fix', source: 'commit 1c3a183' },
      },
      {
        heading: 'The same failure, two months later',
        paras: [
          'On AskPinoy I found seven places where the documents described a safeguard that had never run. One quality check "had never passed". The documents were written by the tools, in confident present tense, and nothing in them was marked as a plan.',
        ],
        receipt: { date: '2026-10', value: '7 claims', window: 'safeguards documented but never run, Oct 2026', source: 'decision record 0038' },
      },
      {
        heading: 'The rules that came out of it',
        paras: [
          'Verify by the outcome, never by the deploy. A document may claim a check only when a test shows the check refusing. Treat every "done" from a model as a claim until something I can observe confirms it.',
          'This is most of what I know about working with models. They fail in a particular way: confident, plausible, unchecked. So I build the checks around that.',
        ],
      },
      {
        heading: 'What I would do differently',
        paras: [
          'Add an alert on the outcome, zero sends in a day, on the first day a scheduled job exists. And turn the written rules that matter most into hooks or tests. I did that on Immortal Drafts, where a commit is blocked until the checks pass. On the other products the rules are still mostly a habit.',
        ],
      },
    ],
    entries: ['fll-crons-found', 'fll-crons-false-fix', 'fll-crons-real-fix', 'fll-attribution', 'ap-false-gates', 'ap-consent'],
  },
]
