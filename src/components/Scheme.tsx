import { motion, useReducedMotion } from 'motion/react'

// The thesis section: how product management changes when coding stops
// being the bottleneck. Every claim here is backed by a repo artifact.
const plays = [
  {
    title: 'Prototype, don’t spec',
    body: 'An idea becomes working software the same afternoon. I decide from the real thing, not a ticket estimate. Sprints answered "what can we afford to build?" — the question now is "which of these working things deserves to live?"',
  },
  {
    title: 'Agents are the team',
    body: 'My products are staffed by rosters of specialized AI agents with written guardrails — growth analyst, SEO lead, copywriter, fantasy expert. I run them like a manager: clear briefs, review everything, own every call.',
  },
  {
    title: 'Validation is the new bottleneck',
    body: 'So it gets the engineering. Gate-reason instrumentation, cohort retention, checkout funnels, ground-truth evals for every AI feature. Ship-or-kill decisions come from data, not ceremony.',
  },
  {
    title: 'Decision logs, not roadmap theater',
    body: 'Dated decisions with the reversed ones struck through, unit economics and kill-gates written before a dollar is spent. The plan is a living record of judgment — anyone can audit why the product is the way it is.',
  },
]

export default function Scheme() {
  const reduced = useReducedMotion()

  return (
    <section className="section scheme-section" id="scheme">
      <div className="wrap">
        <p className="section-kicker">The scheme</p>
        <h2 className="section-title">How one person ships four products</h2>
        <p className="section-sub">
          Scrum and sprints were built to ration scarce engineering time. AI ended that scarcity — coding isn’t the
          bottleneck anymore, judgment is. I run product for that era.
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
