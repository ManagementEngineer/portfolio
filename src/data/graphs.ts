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

export type AgentTeam = { title: string; blurb: string; graph: Graph }

export const agentTeams: Record<string, AgentTeam> = {
  fll: {
    title: '17 role agents, 3 commands',
    blurb:
      'Each role has scoped tools and a model matched to the job: the strongest model for the deciders, lighter ones for narrow checks. After any feature ships, an audit agent walks 21 surfaces of the product looking for anything it broke.',
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
  },
}
