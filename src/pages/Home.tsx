import { useMemo, useState } from 'react'
import {
  agents,
  capabilities,
  closing,
  experience,
  figuresNote,
  opening,
  projects,
  range,
  type Fig,
  type Project,
} from '../data/home'
import { agentTeams, heroLoop, type GKind, type Graph as GraphData } from '../data/graphs'
import { person } from '../data/site'
import Arrow from '../components/Arrow'
import Graph from '../components/Graph'
import { Link } from '../router'

export function SectionHead({ id, title, count }: { id?: string; title: string; count?: string }) {
  return (
    <h2 className="h2" id={id}>
      {title}
      {count && <span className="h2__count">{count}</span>}
    </h2>
  )
}

export function Contact() {
  return (
    <p className="contact">
      <a className="btn" href={`mailto:${person.email}`}>
        Email me
      </a>
      <a className="btn btn--ghost" href={person.linkedin}>
        LinkedIn
        <Arrow kind="out" />
      </a>
      <a className="btn btn--ghost" href={person.github}>
        GitHub
        <Arrow kind="out" />
      </a>
      <a className="btn btn--ghost" href={person.resume}>
        Resume (PDF)
      </a>
    </p>
  )
}

function Sticker({ fig }: { fig: Fig }) {
  return (
    <figure className="sticker">
      <p className="sticker__value">{fig.value}</p>
      <figcaption>
        <span>{fig.what}</span>
        <span className="sticker__key">
          {fig.window} · {fig.source}
        </span>
      </figcaption>
    </figure>
  )
}

const ticker = [
  'Claude Code',
  'agents',
  'subagents',
  'hooks',
  'skills',
  'MCP',
  'Claude API',
  'OpenAI API',
  'TypeScript',
  'Python',
  'Next.js',
  'React',
  'Postgres',
  'Firestore',
  'MongoDB',
  'Supabase',
  'Cloudflare Workers',
  'three.js',
  'Stripe',
  'Vitest',
  'Playwright',
]

function systemGraph(p: Project): GraphData | undefined {
  if (!p.system) return undefined
  const rows = Math.max(...p.system.nodes.map((n) => n.row)) + 1
  return {
    height: rows * 112 + 60,
    nodes: p.system.nodes.map((n) => ({
      id: n.id,
      label: n.label,
      sub: n.sub,
      kind: n.id[0] as GKind,
      x: n.lane * 262,
      y: n.row * 112,
    })),
    edges: p.system.edges.map((e) => ({ from: e.from, to: e.to, label: e.label || undefined, dashed: e.kind === 'message' })),
  }
}

function ProjectBlock({ p }: { p: Project }) {
  const [step, setStep] = useState<number | null>(null)
  const active = useMemo(() => new Set(step !== null && p.flow ? p.flow.steps[step].nodes : []), [step, p.flow])
  const sys = useMemo(() => systemGraph(p), [p])
  const team = agentTeams[p.id]

  return (
    <article className={`project project--${p.id}`} id={p.id}>
      <header className="project__head">
        <div>
          <p className="tag">
            {p.role} · {p.years}
          </p>
          <h3>{p.name}</h3>
          {p.paras.map((t) => (
            <p key={t} className="project__p">
              {t}
            </p>
          ))}
        </div>
        {p.figs.length > 0 && (
          <div className="project__figs">
            {p.figs.map((f) => (
              <Sticker key={f.value} fig={f} />
            ))}
          </div>
        )}
      </header>

      {sys && p.system && (
        <section className="board">
          <div className="board__top">
            <h4>How it works</h4>
            <p>Drag the boxes around. Tap a step below to light up the parts it touches. On a phone, swipe sideways.</p>
          </div>
          <div className="board__scroll">
            <Graph graph={sys} active={active} label={`${p.system.title} system diagram`} />
          </div>
          {p.flow && (
            <>
              <p className="board__flowtitle">{p.flow.title}</p>
              <ol className="steps">
                {p.flow.steps.map((s, i) => (
                  <li key={s.label}>
                    <button
                      type="button"
                      className={`step step--${s.kind}${step === i ? ' is-on' : ''}`}
                      aria-pressed={step === i}
                      onClick={() => setStep(step === i ? null : i)}
                      onMouseEnter={() => setStep(i)}
                      onMouseLeave={() => setStep(null)}
                    >
                      <span className="step__n">{i + 1}</span>
                      <span className="step__label">{s.label}</span>
                      <span className="step__note">{s.note}</span>
                    </button>
                  </li>
                ))}
              </ol>
              {p.flow.caption && <p className="board__caption">{p.flow.caption}</p>}
            </>
          )}
        </section>
      )}

      {team && (
        <section className="board board--team">
          <div className="board__top">
            <h4>The agent team behind it</h4>
            <p className="board__count">{team.title}</p>
          </div>
          <p className="board__blurb">{team.blurb}</p>
          <div className="board__scroll">
            <Graph graph={team.graph} label={`${p.name} agent team diagram`} />
          </div>
          <ul className="legend">
            <li className="legend__me">me</li>
            <li className="legend__team">agents</li>
            <li className="legend__tool">command or skill</li>
            <li className="legend__gate">a check that can refuse</li>
            <li className="legend__out">where it lands</li>
          </ul>
        </section>
      )}

      <footer className="project__foot">
        <dl className="stack">
          {p.stack.map((s) => (
            <div key={s.key}>
              <dt>{s.key}</dt>
              <dd>
                {s.text.split(', ').map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        <ul className="links">
          {p.links.map((l) => (
            <li key={l.href}>
              {l.internal ? (
                <Link to={l.href}>
                  {l.label}
                  <Arrow kind="on" />
                </Link>
              ) : (
                <a href={l.href}>
                  {l.label}
                  <Arrow kind="out" />
                </a>
              )}
            </li>
          ))}
        </ul>
      </footer>
    </article>
  )
}

export default function Home() {
  return (
    <main id="main">
      <section className="hero wrap">
        <div className="hero__text">
          <p className="tag tag--ink">{opening.keys.join(' · ')}</p>
          <h1>
            I build AI products with <em>teams of agents</em>, for people at every level.
          </h1>
          {opening.paras.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <Contact />
        </div>
        <div className="hero__graph">
          <p className="hero__graphtitle">How I work, on a loop</p>
          <Graph graph={heroLoop} label="A loop: a real need, an agent team, checks, shipped, real users" />
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <section className="wrap">
        <SectionHead id="range" title="I've worked at every level" />
        <ul className="range">
          {range.map((r, i) => (
            <li key={r.place} className={`card card--${i}`}>
              <p className="tag">
                {r.place} · {r.years}
              </p>
              <h3>{r.who}</h3>
              <p className="card__role">{r.role}</p>
              <p>{r.text}</p>
              {r.fig && <Sticker fig={r.fig} />}
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap">
        <SectionHead id="work" title="What I've built" />
        {projects.map((p) => (
          <ProjectBlock key={p.id} p={p} />
        ))}
      </section>

      <section className="wrap">
        <SectionHead id="agents" title="How I keep agents honest" />
        <div className="agents">
          <div>
            {agents.intro.map((t) => (
              <p key={t} className="agents__p">
                {t}
              </p>
            ))}
            <ul className="rules">
              {agents.rules.map((r) => (
                <li key={r.rule}>
                  <p className="rules__rule">{r.rule}</p>
                  <p className="rules__why">{r.why}</p>
                </li>
              ))}
            </ul>
            <p className="agents__link">
              <Link to={agents.link.href}>
                {agents.link.label}
                <Arrow kind="on" />
              </Link>
            </p>
          </div>
          <figure className="code">
            <figcaption>{agents.code.path}</figcaption>
            <pre tabIndex={0} role="region" aria-label="Claude Code settings excerpt">
              <code>
                {agents.code.lines.map((line, i) => (
                  <span key={i} className={agents.code.highlight.includes(i + 1) ? 'code__line is-hl' : 'code__line'}>
                    {line}
                    {'\n'}
                  </span>
                ))}
              </code>
            </pre>
            <p className="code__note">{agents.code.note}</p>
          </figure>
        </div>
      </section>

      <section className="wrap">
        <SectionHead id="capabilities" title="What AI teams ask for, and where I've done it" />
        <ul className="caps">
          {capabilities.map((c) => (
            <li key={c.asked}>
              <h3>{c.asked}</h3>
              <p>
                {c.where} {c.link && <a href={c.link.href}>{c.link.label}</a>}.
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap">
        <SectionHead id="experience" title="Experience" />
        <ul className="xp">
          {experience.map((x) => (
            <li key={x.role + x.org}>
              <span className="xp__years">{x.years}</span>
              <div>
                <p className="xp__role">{x.role}</p>
                <p className="xp__org">{x.org}</p>
                {x.note && <p className="xp__note">{x.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="closing wrap">
        <h2>{closing}</h2>
        <Contact />
        <p className="fine">{figuresNote}</p>
      </footer>
    </main>
  )
}
