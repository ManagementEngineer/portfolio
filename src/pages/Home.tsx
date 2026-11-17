import { useState } from 'react'
import {
  agents,
  capabilities,
  closing,
  experience,
  figuresNote,
  opening,
  projects,
  range,
  type Project,
} from '../data/home'
import { person } from '../data/site'
import Arrow from '../components/Arrow'
import Figure from '../components/Figure'
import FlowLine from '../components/FlowLine'
import SystemMap from '../components/SystemMap'
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
      <a href={`mailto:${person.email}`}>Email</a>
      <a href={person.linkedin}>
        LinkedIn
        <Arrow kind="out" />
      </a>
      <a href={person.github}>
        GitHub
        <Arrow kind="out" />
      </a>
      <a href={person.resume}>Resume (PDF)</a>
    </p>
  )
}

function ProjectBlock({ p }: { p: Project }) {
  const [step, setStep] = useState<number | null>(null)
  const active = new Set(step !== null && p.flow ? p.flow.steps[step].nodes : [])
  return (
    <article className="project" id={p.id}>
      <div className="g3">
        <div className="kcol">
          <span>{p.role}</span>
          <span className="mono">{p.years}</span>
        </div>
        <div className="body">
          <h3 className="project__name">{p.name}</h3>
          {p.paras.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
        <div className="evidence">
          {p.figs.map((f) => (
            <Figure key={f.value} fig={f} />
          ))}
        </div>
      </div>

      {p.system && <SystemMap sys={p.system} active={active} id={p.id} />}
      {p.flow && <FlowLine flow={p.flow} step={step} onStep={setStep} />}

      <div className="g3 project__foot">
        <div className="kcol" />
        <dl className="stack body">
          {p.stack.map((s) => (
            <div key={s.key}>
              <dt>{s.key}</dt>
              <dd>{s.text}</dd>
            </div>
          ))}
        </dl>
        <ul className="evidence links">
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
      </div>
    </article>
  )
}

export default function Home() {
  return (
    <main className="wrap" id="main">
      <section className="opening g3">
        <div className="kcol">
          {opening.keys.map((k) => (
            <span key={k}>{k}</span>
          ))}
        </div>
        <div className="opening__main">
          <h1>{opening.statement}</h1>
          <div className="body">
            {opening.paras.map((t) => (
              <p key={t}>{t}</p>
            ))}
            <Contact />
          </div>
        </div>
      </section>

      <section>
        <SectionHead id="range" title="Range" />
        <ul className="range">
          {range.map((r) => (
            <li key={r.place} className="g3">
              <div className="kcol">
                <strong>{r.place}</strong>
                <span>{r.role}</span>
                <span className="mono">{r.years}</span>
              </div>
              <div className="body">
                <p className="lead">{r.who}</p>
                <p>{r.text}</p>
              </div>
              <div className="evidence">{r.fig && <Figure fig={r.fig} />}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHead id="work" title="Work" />
        {projects.map((p) => (
          <ProjectBlock key={p.id} p={p} />
        ))}
      </section>

      <section>
        <div className="g3">
          <div className="kcol">
            <SectionHead id="agents" title="Agents" />
          </div>
          <div className="body">
            {agents.intro.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </div>
        <div className="g3 rules-row">
          <div className="kcol" />
          <ul className="rules body">
            {agents.rules.map((r) => (
              <li key={r.rule}>
                <p className="rules__rule">{r.rule}</p>
                <p className="rules__why">{r.why}</p>
              </li>
            ))}
          </ul>
          <div className="evidence links">
            <Link to={agents.link.href}>
              {agents.link.label}
              <Arrow kind="on" />
            </Link>
          </div>
        </div>
        <div className="g3 code-row">
          <div className="kcol" />
          <div className="body">
            <p className="code__path">{agents.code.path}</p>
            <pre className="code" tabIndex={0} role="region" aria-label="Claude Code settings excerpt">
              <code>
                {agents.code.lines.map((line, i) => (
                  <span key={i} className={agents.code.highlight.includes(i + 1) ? 'code__line is-hl' : 'code__line'}>
                    {line}
                    {'\n'}
                  </span>
                ))}
              </code>
            </pre>
          </div>
          <p className="evidence code__note">{agents.code.note}</p>
        </div>
      </section>

      <section>
        <div className="g3">
          <div className="kcol">
            <SectionHead id="capabilities" title="Capabilities" />
          </div>
          <table className="caps">
            <thead>
              <tr>
                <th scope="col">What AI teams ask for</th>
                <th scope="col">Where I have done it</th>
              </tr>
            </thead>
            <tbody>
              {capabilities.map((c) => (
                <tr key={c.asked}>
                  <th scope="row">{c.asked}</th>
                  <td>
                    {c.where} {c.link && <a href={c.link.href}>{c.link.label}</a>}.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHead id="experience" title="Experience" />
        <ul className="xp">
          {experience.map((x) => (
            <li key={x.role + x.org} className="g3">
              <div className="kcol">
                <span className="mono">{x.years}</span>
              </div>
              <div className="body">
                <p className="xp__role">{x.role}</p>
                <p className="xp__org">{x.org}</p>
                {x.note && <p className="xp__note">{x.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="g3 closing">
        <div className="kcol" />
        <div className="body">
          <p className="lead">{closing}</p>
          <Contact />
          <p className="fine">{figuresNote}</p>
        </div>
      </footer>
    </main>
  )
}
