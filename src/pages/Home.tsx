import { useEffect, useMemo, useRef, useState } from 'react'
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
import { agentTeams, flowSay, tour, type GKind, type Graph as GraphData } from '../data/graphs'
import { person } from '../data/site'
import Arrow from '../components/Arrow'
import Belt from '../components/Belt'
import Cat from '../components/Cat'
import CountUp from '../components/CountUp'
import Guide from '../components/Guide'
import HeroLine from '../components/HeroLine'
import Graph from '../components/Graph'
import Popoy from '../components/Popoy'
import { say } from '../guide'
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
      <p className="sticker__value">
        <CountUp value={fig.value} />
      </p>
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

/* Plays a list of steps one after another, speaking each through Popoy. */
function useWalkthrough(lines: string[], onStep: (i: number | null) => void) {
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const stop = () => {
    window.clearTimeout(timer.current)
    setPlaying(false)
    onStep(null)
    say(null)
  }

  const play = () => {
    if (playing) return stop()
    setPlaying(true)
    const run = (i: number) => {
      if (i >= lines.length) return stop()
      onStep(i)
      say(lines[i])
      const words = lines[i].split(' ').length
      timer.current = window.setTimeout(() => run(i + 1), Math.min(3400, Math.max(2000, 1200 + 220 * words)))
    }
    run(0)
  }

  return { playing, play }
}

function ProjectBlock({ p, n }: { p: Project; n: number }) {
  const [step, setStep] = useState<number | null>(null)
  const [teamStep, setTeamStep] = useState<number | null>(null)
  const active = useMemo(() => new Set(step !== null && p.flow ? p.flow.steps[step].nodes : []), [step, p.flow])
  const sys = useMemo(() => systemGraph(p), [p])
  const team = agentTeams[p.id]
  const teamActive = useMemo(
    () => new Set(teamStep !== null && team?.story ? team.story[teamStep].nodes : []),
    [teamStep, team],
  )
  const flowLines = useMemo(
    () => (p.flow ? p.flow.steps.map((s, i) => flowSay[p.id]?.[i] ?? `${s.label}. ${s.note}`) : []),
    [p.flow, p.id],
  )
  const teamLines = useMemo(() => (team?.story ? team.story.map((s) => s.say) : []), [team])
  const flowTour = useWalkthrough(flowLines, setStep)
  const teamTour = useWalkthrough(teamLines, setTeamStep)

  return (
    <article className={`project project--${p.id}`} id={p.id}>
      <header className="project__head">
        <div>
          <p className="plate">
            <span>Line {String(n).padStart(2, '0')}</span>
            <span>{p.role}</span>
            <span>{p.years}</span>
          </p>
          <h3>
            <a href={p.links[0].href} target="_blank" rel="noopener noreferrer">
              {p.name}
            </a>
          </h3>
          <p className="visit">
            <a className="btn" href={p.links[0].href} target="_blank" rel="noopener noreferrer">
              Visit {p.links[0].label}
              <Arrow kind="out" />
            </a>
          </p>
          {p.paras.map((t) => (
            <p key={t} className="project__p">
              {t}
            </p>
          ))}
        </div>
        {p.image && (
          <figure className="project__image">
            <img src={p.image.src} alt={p.image.alt} width={900} height={691} loading="lazy" />
            <figcaption>{p.image.caption}</figcaption>
          </figure>
        )}
        {p.timeline && (
          <div className="timeline">
            <h4>What I did there, in order</h4>
            <ol>
              {p.timeline.map((e) => (
                <li key={e.when + e.text}>
                  <span>{e.when}</span>
                  <p>{e.text}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
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
            <h4>The system</h4>
            {p.flow && (
              <button type="button" className="play" onClick={flowTour.play} aria-pressed={flowTour.playing}>
                {flowTour.playing ? 'Stop' : 'Walk me through it'}
              </button>
            )}
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
                      onMouseEnter={() => !flowTour.playing && setStep(i)}
                      onMouseLeave={() => !flowTour.playing && setStep(null)}
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
            <h4>The agent line that builds it</h4>
            <p className="board__count">{team.title}</p>
            {team.story && (
              <button type="button" className="play" onClick={teamTour.play} aria-pressed={teamTour.playing}>
                {teamTour.playing ? 'Stop' : 'Walk me through it'}
              </button>
            )}
          </div>
          <p className="board__blurb">{team.blurb}</p>
          <div className="board__scroll">
            <Graph graph={team.graph} active={teamActive} label={`${p.name} agent team diagram`} />
          </div>
          {team.story && (
            <ol className="steps steps--team">
              {team.story.map((st, i) => (
                <li key={st.label}>
                  <button
                    type="button"
                    className={`step${teamStep === i ? ' is-on' : ''}`}
                    aria-pressed={teamStep === i}
                    onClick={() => setTeamStep(teamStep === i ? null : i)}
                    onMouseEnter={() => !teamTour.playing && setTeamStep(i)}
                    onMouseLeave={() => !teamTour.playing && setTeamStep(null)}
                  >
                    <span className="step__n">{i + 1}</span>
                    <span className="step__label">{st.label}</span>
                    <span className="step__note">{st.say}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
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
                <a href={l.href} target="_blank" rel="noopener noreferrer">
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
      <Guide stops={tour} />
      <Cat />
      <section className="hero wrap" id="top">
        <div className="hero__text">
          <p className="plate">
            <span>{opening.keys[0]}</span>
            <span>{opening.keys[1]}</span>
            <span>{opening.keys[2]}</span>
          </p>
          <h1>
            From the plant floor to <em>agent lines</em>.
          </h1>
          <p className="hero__claim">{opening.claim}</p>
          {opening.paras.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <ol className="method">
            {opening.method.map((m, i) => (
              <li key={m.verb}>
                <span className="method__n">{i + 1}</span>
                <strong>{m.verb}</strong>
                <span>{m.text}</span>
              </li>
            ))}
          </ol>
          <Contact />
        </div>
        <div className="hero__graph">
          <HeroLine />
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
        <SectionHead id="range" title="Every station I've worked" />
        <p className="lede-line">
          Scroll, and Popoy walks the line. Each station lights up as he reaches it, and he will tell you what I did
          there.
        </p>
        <Belt label="Career line">
          {range.map((r, i) => (
            <li key={r.place} className="station" data-station>
              <p className="station__no">
                <span className="andon" />
                Station {String(i + 1).padStart(2, '0')}
              </p>
              <p className="station__place">
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.place}
                  </a>
                ) : (
                  r.place
                )}{' '}
                <span>{r.years}</span>
              </p>
              <h3>{r.who}</h3>
              <p className="station__role">{r.role}</p>
              <p className="station__text">{r.text}</p>
              {r.fig && <Sticker fig={r.fig} />}
            </li>
          ))}
        </Belt>
      </section>

      <section className="wrap">
        <SectionHead id="work" title="The lines I run" />
        {projects.map((p, i) => (
          <ProjectBlock key={p.id} p={p} n={i + 1} />
        ))}
      </section>

      <section className="wrap">
        <SectionHead id="agents" title="Standard work: how I keep agents honest" />
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
        <SectionHead id="capabilities" title="Skills matrix: what AI teams ask for" />
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
        <SectionHead id="experience" title="Shift log" />
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

      <footer className="closing wrap" id="end">
        <div className="closing__row">
          <div>
            <h2>{closing}</h2>
            <Contact />
          </div>
          <figure className="supervisor">
            <Popoy pose="sit" px={8} />
            <figcaption>
              <strong>Popoy</strong>
              <span>British Shorthair, golden shaded</span>
              <span>Final inspection. Can refuse.</span>
            </figcaption>
          </figure>
        </div>
        <p className="fine">{figuresNote}</p>
      </footer>
    </main>
  )
}
