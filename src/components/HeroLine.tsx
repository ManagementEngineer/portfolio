import { useEffect, useState } from 'react'
import { popoyRows, type Pose } from './Popoy'
import { say } from '../guide'

/* Cell 00, the hero. A tote tagged DONE comes down the line. Popoy, who is
   final inspection, stops the line, looks at it, and knocks it off. The next
   one is tagged TESTED; that one he stamps, and it ships.
   Plays once on load. Tap Popoy to run it again. */

const PAL: Record<string, string> = {
  o: '#3b2412',
  g: '#e2a455',
  d: '#b9762f',
  l: '#f7dfb0',
  w: '#fffdf6',
  e: '#86a83f',
  p: '#14171a',
  n: '#e8959b',
  k: '#e8a08a',
}

type P = { x: number; y: number }
const NEED: P = { x: 270, y: 58 }
const AGENTS: P = { x: 440, y: 168 }
const CHECKS: P = { x: 372, y: 318 }
const SHIPPED: P = { x: 150, y: 318 }
const USERS: P = { x: 96, y: 168 }

const nodes: { at: P; label: string; sub: string; kind: string; w: number }[] = [
  { at: NEED, label: 'A real need', sub: 'someone asks', kind: 'need', w: 150 },
  { at: AGENTS, label: 'Agent team', sub: 'narrow roles', kind: 'agents', w: 140 },
  { at: CHECKS, label: 'Checks', sub: 'can refuse', kind: 'checks', w: 150 },
  { at: SHIPPED, label: 'Shipped', sub: 'he presses the button', kind: 'shipped', w: 170 },
  { at: USERS, label: 'Real users', sub: 'measured', kind: 'users', w: 140 },
]

const loop = [NEED, AGENTS, CHECKS, SHIPPED, USERS, NEED]
const lerp = (a: P, b: P, t: number): P => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
const clamp = (t: number) => Math.min(1, Math.max(0, t))
/* where a tote stops in front of the inspector */
const GATE: P = { x: CHECKS.x + 34, y: CHECKS.y - 44 }

type Tote = { x: number; y: number; r: number; o: number; tag: string; ok: boolean; show: boolean }
const hidden: Tote = { x: 0, y: 0, r: 0, o: 0, tag: '', ok: false, show: false }

type Frame = { a: Tote; b: Tote; pose: Pose; stopped: boolean; line: string }

const LINES = [
  "I'm Popoy. I inspect this line.",
  'An agent says done. That is a claim.',
  'Refused.',
  'Tested. Now he presses the button.',
  'Real users, measured. Then the loop starts again.',
  'Scroll. I will walk the line with you.',
]

const END = 9200

function frameAt(t: number): Frame {
  let a = hidden
  let b = hidden
  let pose: Pose = 'side'
  let stopped = false
  let line = LINES[0]

  // tote A, tagged DONE: need -> agents -> gate
  if (t < 3900) {
    const p = t < 1500 ? lerp(NEED, AGENTS, clamp((t - 400) / 1100)) : lerp(AGENTS, GATE, clamp((t - 1600) / 900))
    a = { ...p, r: 0, o: t < 400 ? 0 : 1, tag: 'DONE', ok: false, show: true }
  }
  if (t >= 1600) line = LINES[1]
  if (t >= 2500 && t < 4500) stopped = true
  // the swat
  if (t >= 3900 && t < 4500) {
    const k = clamp((t - 3900) / 460)
    pose = t < 4200 ? 'strike' : 'side'
    a = { x: GATE.x + 240 * k, y: GATE.y - 190 * k + 150 * k * k, r: 420 * k, o: 1 - k * k, tag: 'DONE', ok: false, show: k < 1 }
    line = LINES[2]
  }
  if (t >= 4500 && t < 5400) line = LINES[2]
  // tote B, tagged TESTED
  if (t >= 4500) {
    let p: P
    if (t < 5000) p = lerp(NEED, AGENTS, clamp((t - 4500) / 500))
    else if (t < 5500) p = lerp(AGENTS, GATE, clamp((t - 5000) / 500))
    else if (t < 6200) p = GATE
    else if (t < 7000) p = lerp(GATE, SHIPPED, clamp((t - 6200) / 800))
    else p = lerp(SHIPPED, { x: USERS.x, y: USERS.y + 44 }, clamp((t - 7200) / 800))
    const gone = clamp((t - 8100) / 500)
    b = { ...p, r: 0, o: 1 - gone, tag: 'TESTED', ok: t >= 5700, show: gone < 1 }
  }
  if (t >= 5500 && t < 6200) {
    pose = t < 5950 ? 'strike' : 'side'
    stopped = t < 5700
    line = LINES[3]
  }
  if (t >= 6200) line = LINES[3]
  if (t >= 7200) line = LINES[4]
  if (t >= 8500) line = LINES[5]
  return { a, b, pose, stopped, line }
}

function Sprite({ pose, x, y, px }: { pose: Pose; x: number; y: number; px: number }) {
  const rows = popoyRows(pose)
  const w = rows[0].length
  return (
    <svg x={x} y={y} width={w * px} height={rows.length * px} viewBox={`0 0 ${w} ${rows.length}`} shapeRendering="crispEdges">
      {rows.map((row, ry) =>
        row.split('').map((c, rx) => (c === '.' ? null : <rect key={`${rx}-${ry}`} x={rx} y={ry} width={1} height={1} fill={PAL[c]} />)),
      )}
    </svg>
  )
}

function ToteBox({ t }: { t: Tote }) {
  if (!t.show) return null
  return (
    <g transform={`translate(${t.x} ${t.y}) rotate(${t.r})`} opacity={t.o}>
      <rect x={-27} y={-13} width={54} height={26} className={t.ok ? 'hl__tote hl__tote--ok' : 'hl__tote'} />
      <text className="hl__tag" textAnchor="middle" y={4}>
        {t.tag}
      </text>
      {t.ok && <path className="hl__tick" d="M14 -20l5 6l10 -13" />}
    </g>
  )
}

export default function HeroLine() {
  const [t, setT] = useState(0)
  const [run, setRun] = useState(0)

  useEffect(() => {
    // ?t=4100 freezes the scene at that millisecond, for checking a frame
    const frozen = new URLSearchParams(window.location.search).get('t')
    if (frozen !== null) {
      setT(Number(frozen))
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      setT(now - start)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run])

  const f = frameAt(Math.min(t, END))
  const done = t >= END

  // after the inspection, plain totes keep circulating so the line never sits still
  const ambient = done
    ? [0, 0.5].map((offset) => {
        const u = ((t - END) / 9000 + offset) % 1
        const seg = Math.min(4, Math.floor(u * 5))
        return lerp(loop[seg], loop[seg + 1], u * 5 - seg)
      })
    : []

  useEffect(() => {
    say(done ? null : f.line)
    // when the inspection is over he leaves the board and goes loose on the page
    if (done) window.dispatchEvent(new Event('popoy:release'))
  }, [f.line, done])

  useEffect(() => () => say(null), [])

  const replay = () => {
    // call him back to the board for another inspection
    window.dispatchEvent(new Event('popoy:hold'))
    setT(0)
    setRun((r) => r + 1)
  }

  return (
    <div className={f.stopped ? 'hl is-stopped' : 'hl'}>
      <p className="hero__graphtitle">
        <span className={f.stopped ? 'andon andon--stop' : 'andon'} /> Cell 00 · how I work, on a loop
      </p>
      <svg className="hl__scene" viewBox="0 0 540 400" role="img" aria-labelledby="hl-title hl-desc">
        <title id="hl-title">How I work, on a loop</title>
        <desc id="hl-desc">
          A real need goes to an agent team, then to checks that can refuse, then it ships to real users, who are
          measured, and the loop starts again. Popoy the cat inspects at the checks: work tagged done is knocked off the
          line, and work tagged tested is stamped and shipped.
        </desc>
        {loop.slice(0, -1).map((p, i) => {
          const q = loop[i + 1]
          return (
            <g key={i}>
              <path className="hl__belt" d={`M${p.x} ${p.y}L${q.x} ${q.y}`} />
              <path className="hl__dash" d={`M${p.x} ${p.y}L${q.x} ${q.y}`} />
            </g>
          )
        })}
        {nodes.map((n) => (
          <g key={n.kind} className={`hl__node hl__node--${n.kind}`} transform={`translate(${n.at.x - n.w / 2} ${n.at.y - 26})`}>
            <rect className="hl__plate" width={n.w} height={52} />
            <rect className="hl__strip" width={n.w} height={7} />
            <text className="hl__label" x={12} y={30}>
              {n.label}
            </text>
            <text className="hl__sub" x={12} y={44}>
              {n.sub}
            </text>
          </g>
        ))}
        {ambient.map((p, i) => (
          <rect key={i} className="hl__tote hl__tote--small" x={p.x - 9} y={p.y - 7} width={18} height={14} />
        ))}
        <ToteBox t={f.a} />
        <ToteBox t={f.b} />
        <g
          className="hl__cat"
          onClick={replay}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && replay()}
          tabIndex={0}
          role="button"
          aria-label="Popoy the cat. Run the inspection again"
        >
          <Sprite pose={f.pose} x={CHECKS.x - 62} y={CHECKS.y - 26 - 42} px={3} />
        </g>
      </svg>
      <p className="hl__line">
        <span aria-hidden="true">{done ? 'Inspection passed. Popoy is loose on the page now.' : f.line}</span>
        {done && (
          <button type="button" className="hl__again" onClick={replay}>
            Run it again
          </button>
        )}
      </p>
    </div>
  )
}
