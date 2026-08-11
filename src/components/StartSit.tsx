import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

// A working "Who Should You Hire?" — the Who Should I Start pattern, one joke deep.
const rows = [
  { label: 'Ships product solo, concept to launch', rj: true, rep: false },
  { label: 'League commissioner for 15 years', rj: true, rep: false },
  { label: 'Fantasy domain: drafts, waivers, start/sit', rj: true, rep: 'Reads about it' },
  { label: 'AI agents in the daily workflow', rj: true, rep: 'Has opinions' },
  { label: 'Runs pricing tests on real customers', rj: true, rep: false },
  { label: 'Plans around the fantasy calendar', rj: true, rep: 'Plans around Q3' },
]

export default function StartSit() {
  const [verdict, setVerdict] = useState(false)
  const reduced = useReducedMotion()

  return (
    <section className="section startsit-section" id="startsit">
      <div className="wrap">
        <p className="section-kicker">Head-to-head</p>
        <h2 className="section-title">Who should you hire?</h2>
        <p className="section-sub">See who the experts would pick.</p>

        <div className="startsit">
          <div className="startsit__matchup">
            <div className="startsit__player startsit__player--rj">
              <span className="startsit__player-name">Ramuel Batuigas</span>
              <span className="startsit__player-meta">SPM · Free agent</span>
            </div>
            <span className="startsit__vs">VS</span>
            <div className="startsit__player">
              <span className="startsit__player-name">Replacement-level PM</span>
              <span className="startsit__player-meta">Waiver wire</span>
            </div>
          </div>

          <table className="startsit__table">
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="startsit__check">{r.rj === true ? '✓' : r.rj}</td>
                  <th scope="row">{r.label}</th>
                  <td className="startsit__miss">{r.rep === true ? '✓' : r.rep === false ? '—' : r.rep}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!verdict ? (
            <button className="btn-primary" onClick={() => setVerdict(true)}>
              Get expert advice
            </button>
          ) : (
            <motion.div
              className="startsit__verdict"
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="startsit__bar">
                <motion.div
                  className="startsit__bar-fill"
                  initial={reduced ? { width: '100%' } : { width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <p className="startsit__verdict-line">
                <strong className="num">100%</strong> of experts would start Ramuel
              </p>
              <p className="startsit__fineprint">Comparing 3+ candidates is a premium feature.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
