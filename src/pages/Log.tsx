import { useState } from 'react'
import { lanes, log, type Lane } from '../data/site'
import Chart from '../components/Chart'
import { Contact, SectionHead } from './Home'
import { Link } from '../router'

export default function Log() {
  const [filter, setFilter] = useState<Lane[]>(() => {
    const wanted = new URLSearchParams(window.location.search).get('lane')
    return lanes.some((l) => l.id === wanted) ? [wanted as Lane] : []
  })
  return (
    <main className="wrap">
      <p className="back">
        <Link to="/">← Home</Link>
      </p>
      <h1 className="title">The full log</h1>
      <p className="lede">
        Every entry I have written up so far, oldest first. Days are given where the record has them, months where it
        does not. Reversed entries stay in place, struck through.
      </p>
      <SectionHead title="Entries" count={`${log.length}`} />
      <Chart entries={log} filter={filter} onFilter={setFilter} />
      <footer className="foot">
        <Contact />
      </footer>
    </main>
  )
}
