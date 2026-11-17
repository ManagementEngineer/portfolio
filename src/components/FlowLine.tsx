import { useEffect, useRef, useState } from 'react'
import type { Flow } from '../data/home'

/* An ordered flow: stops on one track, numbered, no boxes and no arrowheads.
   Circle is work, square is a check that can refuse, D is a wait.
   Pointing at a stop lights the parts of the system it touches. */

function Stop({ kind }: { kind: 'work' | 'check' | 'wait' }) {
  return (
    <svg className="stop" width={11} height={11} viewBox="0 0 11 11" aria-hidden="true">
      {kind === 'work' && <circle cx={5.5} cy={5.5} r={5.5} />}
      {kind === 'check' && <rect width={11} height={11} />}
      {kind === 'wait' && <path d="M0 0H5.5A5.5 5.5 0 0 1 5.5 11H0Z" />}
    </svg>
  )
}

const word = { work: 'Work', check: 'Check', wait: 'Wait' }

export default function FlowLine({
  flow,
  step,
  onStep,
}: {
  flow: Flow
  step: number | null
  onStep: (i: number | null) => void
}) {
  const [tracing, setTracing] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const trace = () => {
    window.clearTimeout(timer.current)
    if (tracing) {
      setTracing(false)
      onStep(null)
      return
    }
    setTracing(true)
    const run = (i: number) => {
      if (i >= flow.steps.length) {
        setTracing(false)
        onStep(null)
        return
      }
      onStep(i)
      timer.current = window.setTimeout(() => run(i + 1), 1400)
    }
    run(0)
  }

  const kinds = (['work', 'check', 'wait'] as const).filter((k) => flow.steps.some((s) => s.kind === k))

  return (
    <div className="diagram">
      <p className="diagram__title">
        <span>Flow</span>
        {flow.title}
        <button type="button" className="trace" onClick={trace} aria-pressed={tracing}>
          {tracing ? 'Stop' : 'Trace it on the system'}
        </button>
      </p>
      <ol className="flow">
        {flow.steps.map((s, i) => (
          <li
            key={s.label}
            className={step === i ? 'is-on' : undefined}
            tabIndex={0}
            onMouseEnter={() => !tracing && onStep(i)}
            onMouseLeave={() => !tracing && onStep(null)}
            onFocus={() => !tracing && onStep(i)}
            onBlur={() => !tracing && onStep(null)}
          >
            <span className="flow__n">{i + 1}</span>
            <span className="flow__stop">
              <Stop kind={s.kind} />
            </span>
            <span className="flow__label">
              <span className="sr-only">{word[s.kind]}: </span>
              {s.label}
            </span>
            <span className="flow__note">{s.note}</span>
          </li>
        ))}
      </ol>
      <ul className="legend" aria-label="Key">
        {kinds.map((k) => (
          <li key={k}>
            <Stop kind={k} />
            {k === 'work' ? 'work' : k === 'check' ? 'a check that can refuse' : 'a wait'}
          </li>
        ))}
      </ul>
      {flow.caption && <p className="diagram__caption">{flow.caption}</p>}
    </div>
  )
}
