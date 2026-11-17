import {
  alsoBuilding,
  cases,
  decisions,
  figuresNote,
  history,
  howIWork,
  log,
  madeNote,
  opening,
  person,
  stack,
  work,
} from '../data/site'
import Figure from '../components/Figure'
import { Link } from '../router'

export function SectionHead({ id, title, count }: { id?: string; title: string; count?: string }) {
  return (
    <div className="shead">
      <h2 id={id}>{title}</h2>
      <span className="shead__rule" aria-hidden="true" />
      {count && <span className="shead__count">{count}</span>}
    </div>
  )
}

export function Contact() {
  return (
    <p className="contact">
      <a href={`mailto:${person.email}`}>{person.email}</a>
      <a href={person.linkedin}>LinkedIn</a>
      <a href={person.github}>GitHub</a>
      <a href={person.resume}>Resume (PDF)</a>
    </p>
  )
}

export default function Home() {
  return (
    <main className="wrap">
      <section className="open">
        <div className="open__letter">
          <h1>{opening.headline}</h1>
          <p className="open__ask">{opening.ask}</p>
          {opening.letter.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Contact />
        </div>

        <aside className="proofs" aria-label="Three things I have done">
          {opening.proofs.map((p) => (
            <div key={p.value} className="proof">
              <span className="proof__value">{p.value}</span>
              <span className="figure__dim" aria-hidden="true" />
              <span className="proof__label">{p.label}</span>
            </div>
          ))}
        </aside>
      </section>

      <section>
        <SectionHead id="work" title="What I've built" />
        <ul className="work">
          {work.map((w) => (
            <li key={w.id} className="work__row">
              <div className="work__main">
                <h3>{w.name}</h3>
                <p className="work__status">
                  {w.status} · {w.years}
                </p>
                {w.paras.map((p) => (
                  <p key={p} className="work__summary">
                    {p}
                  </p>
                ))}
                {w.built && (
                  <dl className="built">
                    {w.built.map((b) => (
                      <div key={b.label}>
                        <dt>{b.label}</dt>
                        <dd>{b.text}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {w.fig && <Figure fig={w.fig} />}
                <p className="work__links">
                  {w.caseHref && <Link to={w.caseHref}>{w.caseLabel} →</Link>}
                  <a href={w.url}>{w.urlLabel} →</a>
                </p>
              </div>
              <a className="work__shot" href={w.url} tabIndex={-1} aria-hidden="true">
                <img src={w.shot} alt={w.shotAlt} width={960} height={435} loading="lazy" />
              </a>
            </li>
          ))}
        </ul>
        <ul className="also">
          {alsoBuilding.map((a) => (
            <li key={a.name}>
              <a href={a.url}>{a.name}</a>
              <span>{a.note}</span>
            </li>
          ))}
        </ul>
        <p className="fine">{figuresNote}</p>
      </section>

      <section>
        <SectionHead id="decisions" title="Four decisions I'd point to" />
        <ul className="decisions">
          {decisions.map((d) => (
            <li key={d.title}>
              <h3>{d.title}</h3>
              <dl>
                <div>
                  <dt>What I saw</dt>
                  <dd>{d.saw}</dd>
                </div>
                <div>
                  <dt>What I did</dt>
                  <dd>{d.did}</dd>
                </div>
                <div>
                  <dt>What happened</dt>
                  <dd>{d.result}</dd>
                </div>
              </dl>
              <p className="decisions__more">
                <Link to={d.href}>Read the full story →</Link>
              </p>
            </li>
          ))}
        </ul>
        <p className="more">
          I keep a dated log of every real product decision, including the ones I reversed.{' '}
          <Link to="/log">Open the log, {log.length} entries →</Link>
        </p>
      </section>

      <section>
        <SectionHead id="how" title="How I run coding agents" />
        <div className="prose">
          {howIWork.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <table className="rules">
          <thead>
            <tr>
              <th scope="col">Rule</th>
              <th scope="col">Why it exists</th>
            </tr>
          </thead>
          <tbody>
            {howIWork.rules.map((r) => (
              <tr key={r.rule}>
                <td>{r.rule}</td>
                <td>{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="more">
          <Link to="/work/fixed-was-false">{cases[2].title} →</Link>
        </p>
      </section>

      <section>
        <SectionHead id="stack" title="Stack" />
        <dl className="built built--stack">
          {stack.map((b) => (
            <div key={b.label}>
              <dt>{b.label}</dt>
              <dd>{b.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <SectionHead id="history" title="Experience" />
        <ul className="history">
          {history.map((h) => (
            <li key={h.role}>
              <span className="history__years">{h.years}</span>
              <div>
                <h3>{h.role}</h3>
                <p className="history__org">{h.org}</p>
                {h.note && <p>{h.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="foot">
        <p className="foot__ask">{opening.ask}</p>
        <Contact />
        <p className="fine">{madeNote}</p>
      </footer>
    </main>
  )
}
