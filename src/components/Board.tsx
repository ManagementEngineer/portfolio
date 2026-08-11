import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { projects, type Project } from '../data/profile'
import PositionBadge, { posTint } from './PositionBadge'

// Projects as a tiered draft board. Rows expand into scouting reports —
// the conceit is the packaging; the case study is the substance.
export default function Board() {
  return (
    <section className="section" id="board">
      <div className="wrap">
        <p className="section-kicker">Player rankings</p>
        <h2 className="section-title">The board</h2>
        <p className="section-sub">
          Fantasy League Lottery is the flagship — live, revenue-generating, run solo for four draft seasons. Below it,
          experiments from the same lab. Open a row for the scouting report.
        </p>

        <div className="board">
          <div className="board__head board__row-grid" aria-hidden>
            <span>RK</span>
            <span>POS</span>
            <span>Player</span>
            <span className="board__head-stat">Stat line</span>
            <span>Status</span>
          </div>
          {projects.map((p, i) => (
            <BoardRow key={p.slug} project={p} rank={i + 1} showTier={i === 0 || projects[i - 1].tier !== p.tier} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BoardRow({ project: p, rank, showTier }: { project: Project; rank: number; showTier: boolean }) {
  const [open, setOpen] = useState(rank === 1)
  const reduced = useReducedMotion()

  return (
    <>
      {showTier && <div className="board__tier">Tier {p.tier}</div>}
      <motion.div
        className="board__row"
        style={{ ['--row-tint' as string]: posTint(p.pos) }}
        initial={reduced ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45, delay: 0.05 * rank, ease: 'easeOut' }}
      >
        <button
          className="board__row-btn board__row-grid"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={`report-${p.slug}`}
        >
          <span className="board__rank num">{rank}</span>
          <PositionBadge pos={p.pos} />
          <span className="board__player">
            <span className="board__name">{p.name}</span>
            <span className="board__tagline">{p.tagline}</span>
          </span>
          <span className="board__stat num">{p.statLine}</span>
          <span className={`board__status board__status--${p.status === 'LIVE' ? 'live' : 'other'}`}>{p.status}</span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={`report-${p.slug}`}
              className="report"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduced ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="report__inner">
                <div className="report__main">
                  <p className="report__label">Scouting report</p>
                  <p className="report__desc">{p.description}</p>
                  <ul className="report__highlights">
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
                <div className="report__side">
                  <p className="report__label">Role</p>
                  <p>{p.role}</p>
                  <p className="report__label">Seasons</p>
                  <p className="num">{p.period}</p>
                  <p className="report__label">Scheme</p>
                  <p className="report__stack">{p.stack.join(' · ')}</p>
                  {p.url && (
                    <a className="report__link" href={p.url} target="_blank" rel="noreferrer">
                      Visit {new URL(p.url).hostname.replace('www.', '')} ↗
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
