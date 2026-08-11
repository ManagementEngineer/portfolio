import { motion, useReducedMotion } from 'motion/react'

// The thesis section: how product management changes when coding stops
// being the bottleneck. Every claim here is backed by a repo artifact.
const plays = [
  {
    title: 'Prototype, don’t spec',
    body: 'A working prototype is the highest-bandwidth way to judge an idea — you touch it instead of reading about it. Ideas become software the same afternoon, and "which of these working things deserves to live?" replaces the estimate meeting.',
  },
  {
    title: 'Agents are the team',
    body: 'Rosters of specialized AI agents with written guardrails — growth analyst, SEO lead, copywriter, fantasy expert. Briefs and guardrails mean their work comes back decision-ready, so my attention goes to the call, not the redo.',
  },
  {
    title: 'Compress reality into signal',
    body: 'Gate-reason instrumentation, cohort retention, checkout funnels, ground-truth evals for every AI feature — thousands of sessions distilled into a handful of numbers a human can act on daily. Ship-or-kill comes from signal, not ceremony.',
  },
  {
    title: 'Decision logs, not roadmap theater',
    body: 'Dated decisions with the reversed ones struck through, unit economics and kill-gates written before a dollar is spent. Written judgment never needs re-digesting — nothing gets re-litigated from scratch.',
  },
]

export default function Scheme() {
  const reduced = useReducedMotion()

  return (
    <section className="section scheme-section" id="scheme">
      <div className="wrap">
        <p className="section-kicker">The scheme</p>
        <h2 className="section-title">How a team of one ships like ten</h2>
        <p className="section-sub">
          Scrum and sprints were built to ration scarce engineering time. AI ended that scarcity — coding isn’t the
          bottleneck anymore. The real limit is how much information one person can digest in a day, so that’s what I
          engineer: a system that fits a whole product business into one human’s daily read.
        </p>

        <div className="scheme">
          {plays.map((p, i) => (
            <motion.div
              key={p.title}
              className="scheme__play"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: 0.07 * i, ease: 'easeOut' }}
            >
              <h3 className="scheme__title">{p.title}</h3>
              <p className="scheme__body">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
