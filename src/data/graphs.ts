// Graph data for the animated diagrams: the hero loop and the agent team behind each project.
// Agent names are the real role files in each project's repo.

export type GKind = 'me' | 'agent' | 'team' | 'tool' | 'gate' | 'out' | 'C' | 'S' | 'D' | 'A' | 'X'

export type GNode = {
  id: string
  label: string
  sub?: string
  kind: GKind
  x: number
  y: number
  chips?: string[]
}

export type GEdge = { from: string; to: string; label?: string; dashed?: boolean }

export type Graph = { nodes: GNode[]; edges: GEdge[]; height: number }

export const heroLoop: Graph = {
  height: 400,
  nodes: [
    { id: 'need', label: 'A real need', sub: 'someone asks', kind: 'me', x: 150, y: 0 },
    { id: 'agents', label: 'Agent team', sub: 'narrow roles', kind: 'team', x: 330, y: 110 },
    { id: 'checks', label: 'Checks', sub: 'can refuse', kind: 'gate', x: 260, y: 260 },
    { id: 'ship', label: 'Shipped', sub: 'I press the button', kind: 'tool', x: 40, y: 260 },
    { id: 'users', label: 'Real users', sub: 'measured', kind: 'out', x: 0, y: 110 },
  ],
  edges: [
    { from: 'need', to: 'agents' },
    { from: 'agents', to: 'checks' },
    { from: 'checks', to: 'ship' },
    { from: 'ship', to: 'users' },
    { from: 'users', to: 'need' },
  ],
}

export type StoryStep = { label: string; nodes: string[]; say: string }

export type AgentTeam = { title: string; blurb: string; graph: Graph; story?: StoryStep[] }

export const agentTeams: Record<string, AgentTeam> = {
  fll: {
    title: '17 role agents, 3 commands',
    blurb:
      'The core was hand-written before any of this existed. The agents joined in 2026. Each role has scoped tools and a model matched to the job: the strongest model for the deciders, lighter ones for narrow checks. After any feature ships, an audit agent walks 21 surfaces of the product looking for anything it broke.',
    graph: {
      height: 430,
      nodes: [
        { id: 'me', label: 'Me', sub: 'decide, review', kind: 'me', x: 0, y: 150 },
        { id: 'decide', label: 'Decide', kind: 'team', x: 210, y: 0, chips: ['ceo', 'cto', 'strategic-advisor', 'product-manager'] },
        { id: 'grow', label: 'Grow', kind: 'team', x: 210, y: 250, chips: ['growth', 'marketing', 'seo', 'copywriter', 'designer'] },
        { id: 'build', label: 'Build', kind: 'team', x: 520, y: 0, chips: ['frontend-engineer', 'fullstack-engineer', 'data-engineer', 'database-schema', 'threejs-animation'] },
        { id: 'check', label: 'Check', kind: 'gate', x: 520, y: 250, chips: ['feature-audit', 'mobile-qa', 'fantasy-league-expert'] },
        { id: 'ship', label: '/ship', sub: 'build + test, then commit', kind: 'tool', x: 850, y: 90 },
        { id: 'prod', label: 'Production', sub: 'paying customers', kind: 'out', x: 850, y: 270 },
      ],
      edges: [
        { from: 'me', to: 'decide', label: 'ask' },
        { from: 'me', to: 'grow', label: 'ask' },
        { from: 'decide', to: 'build', label: 'plan' },
        { from: 'grow', to: 'build', label: 'copy, SEO' },
        { from: 'build', to: 'check', label: '/audit' },
        { from: 'check', to: 'ship', label: '21 checks' },
        { from: 'ship', to: 'prod', label: 'deploy' },
      ],
    },
    story: [
      { label: "Ask", nodes: ["me", "decide", "grow"], say: "He asks. Decide and Grow answer." },
      { label: "Route", nodes: ["decide", "check"], say: "Deciders get the strongest model. Narrow checks get lighter ones." },
      { label: "Plan", nodes: ["decide", "grow", "build"], say: "Decide sends the plan. Grow sends copy and SEO." },
      { label: "Audit", nodes: ["build", "check"], say: "/audit: an agent walks 21 surfaces for anything broken." },
      { label: "Ship", nodes: ["check", "ship"], say: "/ship builds and tests, then commits." },
      { label: "Land", nodes: ["ship", "prod"], say: "Out to production, where the paying customers are." },
    ],
  },
  immortal: {
    title: '6 venture agents, 1 reviewer, 7 skills',
    blurb:
      'A /standup skill that only I can trigger runs five memos in parallel, then a round of cross-feedback, then a decision. The agents write what should happen. They never deploy, post, email or spend: I do those.',
    graph: {
      height: 430,
      nodes: [
        { id: 'me', label: 'Me', sub: 'run /standup', kind: 'me', x: 0, y: 90 },
        { id: 'standup', label: '/standup', sub: 'skill', kind: 'tool', x: 190, y: 90 },
        { id: 'memos', label: 'Memos, in parallel', kind: 'team', x: 430, y: 0, chips: ['product', 'growth', 'content', 'analyst', 'revenue'] },
        { id: 'ceo', label: 'ceo', sub: 'decides, cites the rulebook', kind: 'agent', x: 790, y: 30 },
        { id: 'score', label: 'Scorecard', sub: 'prediction logged first', kind: 'out', x: 1110, y: 30 },
        { id: 'review', label: 'spec-reviewer', sub: 'read-only, cheaper model', kind: 'agent', x: 190, y: 290 },
        { id: 'hook', label: 'Commit hook', sub: 'typecheck + content check', kind: 'gate', x: 520, y: 290 },
        { id: 'live', label: 'Live', sub: 'I deploy', kind: 'out', x: 860, y: 290 },
      ],
      edges: [
        { from: 'me', to: 'standup' },
        { from: 'standup', to: 'memos', label: 'needs a number' },
        { from: 'memos', to: 'ceo', label: 'feedback' },
        { from: 'ceo', to: 'score', label: 'bet' },
        { from: 'me', to: 'review', label: 'diff vs spec' },
        { from: 'review', to: 'hook', label: 'git commit' },
        { from: 'hook', to: 'live', label: 'passes' },
      ],
    },
    story: [
      { label: "Trigger", nodes: ["me", "standup"], say: "Only he can run /standup." },
      { label: "Memos", nodes: ["standup", "memos"], say: "Five memos in parallel. Every one needs a number." },
      { label: "Decide", nodes: ["memos", "ceo"], say: "Cross-feedback, then ceo decides and cites the rulebook." },
      { label: "Bet", nodes: ["ceo", "score"], say: "The bet goes on a scorecard. Prediction logged first." },
      { label: "Review", nodes: ["me", "review"], say: "Second track. spec-reviewer reads the diff against the spec." },
      { label: "Gate", nodes: ["review", "hook", "live"], say: "The hook blocks a bad commit. Then he deploys, not them." },
    ],
  },
  askpinoy: {
    title: '8 roles and a lead, under a written protocol',
    blurb:
      'Round one is independent: no role may read another role\'s review. They talk only through thread files. Compliance can veto, QA can block, and production moves only when I type the promote phrase.',
    graph: {
      height: 430,
      nodes: [
        { id: 'me', label: 'Me', sub: 'founder', kind: 'me', x: 0, y: 150 },
        { id: 'lead', label: 'lead', sub: '/team-round', kind: 'tool', x: 180, y: 150 },
        { id: 'roles', label: 'Independent reviews', kind: 'team', x: 380, y: 0, chips: ['cto', 'product', 'backend', 'frontend', 'design', 'seo', 'compliance', 'qa'] },
        { id: 'threads', label: 'Thread files', sub: 'the only channel', kind: 'out', x: 400, y: 280 },
        { id: 'comp', label: 'compliance', sub: 'can veto, must name the law', kind: 'gate', x: 690, y: 30 },
        { id: 'qa', label: 'qa', sub: 'can block the gate', kind: 'gate', x: 690, y: 280 },
        { id: 'cto', label: 'cto', sub: 'owns spec + 46 decisions', kind: 'agent', x: 950, y: 30 },
        { id: 'promote', label: 'Production', sub: 'I type the phrase', kind: 'out', x: 950, y: 280 },
      ],
      edges: [
        { from: 'me', to: 'lead' },
        { from: 'lead', to: 'roles', label: 'round 1' },
        { from: 'roles', to: 'threads', label: 'one file each' },
        { from: 'roles', to: 'comp', label: 'issues' },
        { from: 'threads', to: 'qa', label: 'fix rounds' },
        { from: 'comp', to: 'cto', label: 'pass or veto' },
        { from: 'qa', to: 'promote', label: 'gate passes' },
      ],
    },
    story: [
      { label: "Start", nodes: ["me", "lead"], say: "He starts a round. The lead runs /team-round." },
      { label: "Round one", nodes: ["lead", "roles"], say: "Round one: eight reviews. No role reads another's." },
      { label: "Threads", nodes: ["roles", "threads"], say: "They talk only through thread files. One file each." },
      { label: "Veto", nodes: ["roles", "comp", "cto"], say: "Compliance can veto. It must name the law." },
      { label: "Block", nodes: ["threads", "qa"], say: "QA can block the gate. Fix rounds until it passes." },
      { label: "Promote", nodes: ["qa", "promote"], say: "Production moves only when he types the phrase." },
    ],
  },
  rings: {
    title: '10 roles, one writer',
    blurb:
      'Lots of roles may suggest. Only one may write to the store, and it checks which store it is connected to before the first write, because the connection once pointed at the wrong one. Publishing is my click.',
    graph: {
      height: 430,
      nodes: [
        { id: 'me', label: 'Me', sub: 'owner', kind: 'me', x: 0, y: 150 },
        { id: 'ideas', label: 'Ideas and copy', kind: 'team', x: 200, y: 0, chips: ['trend-scout', 'ring-cmo', 'hype-director', 'seo-lead', 'ring-copywriter', 'brand-artist'] },
        { id: 'analyst', label: 'growth-analyst', sub: 'read-only', kind: 'agent', x: 200, y: 290 },
        { id: 'director', label: 'design-director', sub: 'reviews', kind: 'gate', x: 530, y: 30 },
        { id: 'ops', label: 'league-ops', sub: 'supplier, fulfilment', kind: 'agent', x: 530, y: 290 },
        { id: 'merch', label: 'merchandiser', sub: 'the only writer', kind: 'tool', x: 790, y: 150 },
        { id: 'store', label: 'Shopify', sub: 'publish is my click', kind: 'out', x: 1010, y: 150 },
      ],
      edges: [
        { from: 'me', to: 'ideas', label: 'brief' },
        { from: 'me', to: 'analyst', label: 'ask' },
        { from: 'ideas', to: 'director', label: 'drafts' },
        { from: 'analyst', to: 'ops', label: 'numbers' },
        { from: 'director', to: 'merch', label: 'approved' },
        { from: 'ops', to: 'merch', label: 'orders' },
        { from: 'merch', to: 'store', label: 'store check first' },
      ],
    },
    story: [
      { label: "Brief", nodes: ["me", "ideas", "analyst"], say: "He briefs six idea roles. The analyst is read-only." },
      { label: "Review", nodes: ["ideas", "director"], say: "Drafts go to design-director for review." },
      { label: "Numbers", nodes: ["analyst", "ops", "merch"], say: "Numbers go to league-ops. It handles supplier and fulfilment." },
      { label: "One writer", nodes: ["director", "merch"], say: "Ten roles may suggest. Only merchandiser may write." },
      { label: "Store check", nodes: ["merch", "store"], say: "It confirms the store first. The connection once pointed wrong." },
      { label: "Publish", nodes: ["store"], say: "Publishing is his click." },
    ],
  },
}

/* What Popoy says at each step of a project's system walkthrough. */
export const flowSay: Record<string, string[]> = {
  fll: [
    'The commissioner sets the teams and the odds.',
    'The server draws. The browser never decides the order.',
    'Inputs and result get hashed, SHA-256, and stored.',
    'Now we wait. The order stays hidden until reveal time.',
    'The league watches a show. It lands on the stored order.',
    'Anyone can recompute the hash from the published inputs.',
  ],
  immortal: [
    'One seed deals every spin.',
    'The player picks five from what the seed dealt.',
    'The browser plays the tournament. Integer maths only.',
    'Browser sends seed and picks. Never a result.',
    'Server replays the draft. A pick never dealt? Refused.',
    'Server plays its own run and stores that one.',
  ],
  askpinoy: [
    'A visitor suggests a business. Bot check runs first.',
    'The database limits by IP hash. Row goes in pending.',
    'Pending rows stay off the site. Row-level security.',
    'He phones the business. The owner confirms the details.',
    'Unconfirmed? The database trigger refuses to publish it.',
    'Confirmed. Cache cleared, the public page appears.',
  ],
  rings: [
    'A shopper uploads a photo.',
    'Origin and per-IP limit get checked before any paid call.',
    'The image model returns a preview. Lettering draws in the browser.',
    'The artwork rides with the cart through Shopify checkout.',
    'Dry run. The script prints the order and sends nothing.',
    'Art is regenerated at print size, lettering composited.',
    'Print order created on hold. He releases it by hand.',
  ],
}

/* Popoy's tour: one line per stop, in page order. */
export const tour = [
  { id: 'top', say: 'Scroll. I will walk the line with you.', next: 'To the stations', hideCat: true },
  { id: 'range', say: 'Four stations. I walk, you scroll.', next: 'To the lines' },
  { id: 'work', say: 'Five lines. Each one is numbered. Start at 01.', next: 'Line 01' },
  { id: 'kuvai', say: 'Line 01, Kuvai. No diagram here. The words cover it.', next: 'Line 02' },
  { id: 'fll', say: 'Line 02. 43,900 lotteries. Half a million draft spots. Watch one draw.', next: 'Line 03' },
  { id: 'immortal', say: 'Line 03. Live two days after he wrote the spec.', next: 'Line 04' },
  { id: 'askpinoy', say: 'Line 04. It opens when 60 businesses are listed.', next: 'Line 05' },
  { id: 'rings', say: 'Line 05. Whatever costs money here is guarded twice.', next: 'Standard work' },
  { id: 'agents', say: 'Four rules. Each one came from a real incident.', next: 'Skills matrix' },
  { id: 'capabilities', say: 'Nine things AI teams ask for. Each points at the work.', next: 'Shift log' },
  { id: 'experience', say: 'The shift log. Jobs first, then school.', next: 'End of the line' },
  { id: 'end', say: 'End of the line. You passed inspection. He is happy to talk.', hideCat: true },
]

/* What Popoy says when you tap him, by section. */
export const explain: Record<string, string> = {
  top: 'This is Ramuel\'s site. He is a developer with a product hat, and the customer always comes first. I inspect his work. Scroll down, then tap me again.',
  range: 'Four places he has worked, from the plant floor to his own customers. Scroll, and I will call out each one.',
  work: 'Five things he runs. Kuvai is his job. The other four he does end to end, by himself: idea, design, code, pricing, launch and support.',
  kuvai: 'His day job. He joined pre-seed, started on GPT-3.5, moved the CTO off Streamlit, and led the Mac and iPhone apps through App Store approval. His team pipeline runs Playwright tests, and pull requests carry screenshots, and videos when needed, as proof.',
  fll: 'His own product. He wrote the core by hand, and it has earned CA$11,000. Press "Walk me through it" to watch one draw.',
  immortal: 'A free esports game. Browser and server run the same simulation, so nobody can fake a result.',
  askpinoy: 'A directory of Filipino-owned businesses. Nothing is listed until the owner confirms it.',
  rings: 'A store for fantasy leagues. Anything that costs money is guarded twice.',
  agents: 'The rules his agents work under. Each one exists because something went wrong once.',
  capabilities: 'What AI teams ask for, matched to where on this page he has done it.',
  experience: 'His jobs, newest first, then school.',
  end: 'That is the whole line. Email him. I am going back to sleep.',
}

/* What Popoy says as the tote reaches each career station, and when tapped there. */
export const stationSay = [
  'Toyota. The parts he designed let every RAV4 in Canada get built.',
  'Amazon. Two hours of reporting, down to five minutes. Managers across Canada used it.',
  'Kuvai. He joined before the first investor. He talked the CTO out of Streamlit.',
  'His own product. Real customers pay for it, and he answers every one himself.',
]

export const stationExplain = [
  'At Toyota the parts he designed made it possible to manufacture every RAV4 built in Canada. He worked with Toyota engineers across North America.',
  'At Amazon he ran Canada\'s top same-day station. He also wrote a script that cut a manager\'s report from 2 hours to 5 minutes. Area managers all over Canada used it.',
  'He joined Kuvai pre-seed, before its first investor, and reports to the CTO and the CEO. He started on GPT-3.5, convinced the CTO to switch from Streamlit to JavaScript, and built the team\'s AI development pipeline.',
  'Fantasy League Lottery is his own product. He wrote the core by hand, and he answers every customer himself.',
]

/* Popoy the wingman: in each part of the page he goes to the thing most worth
   reading, points it out, and says why it matters. Each line plays once. */
export const wingman: Record<string, { sel: string; say: string }[]> = {
  top: [
    { sel: '.method', say: 'Ask, measure, find the gap, fix it. In that order. I checked.' },
  ],
  work: [{ sel: '#kuvai', say: 'Line 01 is his job. The other four he does end to end, alone. Start with Kuvai.' }],
  kuvai: [
    { sel: '#kuvai', say: 'Pre-seed. He bet on it before anyone had put money in.' },
    { sel: '#kuvai .project__p ~ .project__p', say: 'His pipeline brings proof. Playwright runs the tests, and pull requests carry screenshots and videos.' },
    { sel: '#kuvai .project__image', say: 'He led the Mac and iPhone apps too. Built, submitted, approved.' },
    { sel: '#kuvai .timeline', say: 'Two years of his work, in order. Read three of these and you will get it.' },
    { sel: '#kuvai .stack', say: 'He started on GPT-3.5 and moved the CTO off Streamlit. Ask him how.' },
  ],
  fll: [
    { sel: '#fll .project__figs .sticker:nth-child(2)', say: '43,900 lotteries, 12 teams each. Half a million draft spots decided on his product.' },
    { sel: '#fll .project__figs .sticker:nth-child(3)', say: "CA$11,000. That's a lot of kibbles." },
    { sel: '#fll .board', say: 'Press "Walk me through it". He wrote this core by hand, before AI.' },
    { sel: '#fll .board--team', say: 'Seventeen agents work this line. He runs them. I inspect them.' },
  ],
  immortal: [
    { sel: '#immortal', say: 'Spec to live in two days. 2,398 players showed up in four.' },
    { sel: '#immortal .board', say: 'A fake result gets refused here. Press play and watch.' },
  ],
  askpinoy: [{ sel: '#askpinoy .board', say: 'Nothing is listed until the owner says yes. The database enforces it.' }],
  rings: [{ sel: '#rings .board', say: 'Anything that costs money here is guarded twice. I counted.' }],
  agents: [
    { sel: '.rules li:first-child', say: 'Every rule here came from something that broke. He writes the lesson down.' },
    { sel: '.code', say: 'This rule is enforced by code. Exit 2 blocks the commit.' },
  ],
  capabilities: [{ sel: '.caps li:first-child', say: 'This is what AI teams ask for. Each row points at the work above.' }],
  experience: [{ sel: '.xp li:first-child', say: 'Plant floor first, AI engineer now. Newest job on top.' }],
  end: [
    { sel: '.closing h2', say: 'You read this far. The email button is right there.' },
    { sel: '.supervisor', say: 'That is me. I look better in pixels.' },
  ],
}
