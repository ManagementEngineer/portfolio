import { useState } from 'react'
import {
  dropped,
  figuresNote,
  history,
  howIWork,
  kuvai,
  lanes,
  log,
  madeNote,
  opening,
  person,
  work,
  type Lane,
} from '../data/site'
import Chart from '../components/Chart'
import Figure from '../components/Figure'
import Sym from '../components/Sym'
import { Link, navigate } from '../router'

const featured = log.filter((e) => e.featured)

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
  const [filter, setFilter] = useState<Lane[]>([])

  const pick = (lane: Lane) => navigate(`/log?lane=${lane}`)

  return (
    <main className="wrap">
      <section className="open">
        <div className="open__letter">
          <h1>{opening.headline}</h1>
          {opening.letter.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Contact />
        </div>

        <aside className="tally" aria-label="The record so far">
          <div className="tally__head">
            <span>The record so far</span>
            <span>{log.length} entries</span>
          </div>
          <ul>
            {lanes.map((l) => (
              <li key={l.id}>
                <button type="button" onClick={() => pick(l.id)} title={`Open the full log showing ${l.label.toLowerCase()} entries`}>
                  <Sym lane={l.id} on />
                  <span className="tally__label">{l.label}</span>
                  <span className="tally__means">{l.means}</span>
                  <span className="tally__n">{log.filter((e) => e.lane === l.id).length}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="tally__start">
            <span>Start here</span>
            <Link to={opening.startHere.href}>{opening.startHere.label} →</Link>
          </div>
        </aside>
      </section>

      <section className="thesis">
        <p>{opening.thesis}</p>
        <p>
          {opening.ask} I'm in {person.location}. Everything below has a date and a source.
        </p>
      </section>

      <section>
        <SectionHead id="work" title="Work" />
        <ul className="work">
          {work.map((w, i) => (
            <li key={w.id} className={i === 0 ? 'work__row work__row--lead' : 'work__row'}>
              <span className="work__sym" title={w.state === 'held' ? 'Held' : 'Shipped'}>
                <Sym lane={w.state} on />
              </span>
              <div className="work__main">
                <h3>{w.name}</h3>
                <p className="work__status">
                  {w.status} · {w.years}
                </p>
                <p className="work__summary">{w.summary}</p>
                {w.more && <p className="work__summary">{w.more}</p>}
                <p className="work__links">
                  {w.caseHref && <Link to={w.caseHref}>Case study →</Link>}
                  {w.url && <a href={w.url}>{w.urlLabel} →</a>}
                </p>
              </div>
              <Figure fig={w.fig} />
            </li>
          ))}
        </ul>
        <p className="fine">{figuresNote}</p>
      </section>

      <section>
        <SectionHead id="log" title="The log" count={`${featured.length} of ${log.length} shown`} />
        <p className="lede">
          Oldest first. Each entry sits in the lane for what kind of call it was. A reversed entry stays where it was,
          struck through. Select a headline for the detail.
        </p>
        <Chart entries={featured} filter={filter} onFilter={setFilter} />
        <p className="more">
          <Link to="/log">Open the full log, {log.length} entries →</Link>
        </p>
      </section>

      <section className="split">
        <div>
          <SectionHead title="Three write-ups" />
          <ul className="cases">
            <li>
              <Link to="/work/ai-credits">I gave 418 people free AI credits. Nobody spent one.</Link>
              <span>Killing an AI plan on one number.</span>
            </li>
            <li>
              <Link to="/work/what-sells">The best thing I built does not sell.</Link>
              <span>What commissioners actually pay for.</span>
            </li>
            <li>
              <Link to="/work/fixed-was-false">&ldquo;Fixed&rdquo; was false twice.</Link>
              <span>How I check work I did not write.</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <SectionHead id="how" title="How I work" />
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
        <div className="prose">
          {howIWork.limits.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section>
        <SectionHead id="kuvai" title="Kuvai" />
        <div className="prose">
          {kuvai.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section>
        <SectionHead id="history" title="History" />
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

      <section>
        <SectionHead title="Dropped" count={`${dropped.length} things`} />
        <ul className="dropped">
          {dropped.map((d) => (
            <li key={d.name}>
              <Sym lane="killed" on />
              <span className="dropped__name">{d.name}</span>
              <span className="dropped__note">{d.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="foot">
        <Contact />
        <p className="fine">{madeNote}</p>
      </footer>
    </main>
  )
}
