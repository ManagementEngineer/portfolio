import { useState } from 'react'
import { cases, log, type CaseStudy, type Lane } from '../data/site'
import Chart from '../components/Chart'
import { Contact, SectionHead } from './Home'
import { Link } from '../router'

export default function Case({ study }: { study: CaseStudy }) {
  const [filter, setFilter] = useState<Lane[]>([])
  const entries = log.filter((e) => study.entries.includes(e.id))
  const next = cases[(cases.indexOf(study) + 1) % cases.length]

  return (
    <main className="wrap page" id="main">
      <p className="back">
        <Link to="/">Home</Link>
      </p>
      <p className="case__product">{study.product}</p>
      <h1 className="title">{study.title}</h1>
      <dl className="facts">
        {study.facts.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      <article className="case">
        {study.sections.map((s) => (
          <section key={s.heading} className="case__section">
            <aside className="case__margin">
              {s.receipt && (
                <div className="receipt">
                  <time dateTime={s.receipt.date}>{s.receipt.date}</time>
                  <span className="receipt__value">{s.receipt.value}</span>
                  <span className="figure__dim" aria-hidden="true" />
                  <span className="receipt__window">{s.receipt.window}</span>
                  <span className="receipt__source">{s.receipt.source}</span>
                </div>
              )}
            </aside>
            <div className="case__text">
              <h2>{s.heading}</h2>
              {s.paras.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      <SectionHead title="These calls in the log" count={`${entries.length} entries`} />
      <Chart entries={entries} filter={filter} onFilter={setFilter} showProduct={false} />

      <p className="more">
        Next: <Link to={`/work/${next.slug}`}>{next.title}</Link>
      </p>
      <footer className="foot">
        <Contact />
      </footer>
    </main>
  )
}
