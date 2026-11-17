import { groupWord, type Group, type SysEdge, type SysNode, type System } from '../data/home'

/* System diagrams. One data model, two drawings:
   a four-lane map at desktop width, and a single-track rail below it.
   Groups are told apart by outline, never by colour. */

const W = 168
const H = 56
const LANE = 294
const ROW = 98

type Box = { x: number; y: number; w: number; h: number }
type Drawn = { d: string; lx: number; ly: number; anchor: 'start' | 'middle' | 'end' }

function NodeShape({ n, b, on }: { n: SysNode; b: Box; on: boolean }) {
  const g = n.id[0] as Group
  const { x, y, w, h } = b
  return (
    <g className={on ? 'n is-on' : 'n'}>
      {g !== 'X' && <rect className="node-fill" x={x} y={y} width={w} height={h} />}
      {g === 'D' ? (
        <path className="node-line" d={`M${x} ${y}H${x + w}M${x} ${y + h}H${x + w}`} />
      ) : (
        <rect className={g === 'X' ? 'node-line node-line--ext' : 'node-line'} x={x} y={y} width={w} height={h} />
      )}
      {g === 'C' && <path className="node-line" d={`M${x} ${y + 7}H${x + w}`} />}
      {g === 'A' && <rect className="node-line" x={x + 3} y={y + 3} width={w - 6} height={h - 6} />}
      <text className="node-label" x={x + 14} y={y + 25}>
        {n.label}
      </text>
      <text className="node-sub" x={x + 14} y={y + 43}>
        {n.sub}
      </text>
      <text className="node-code" x={x + w - 14} y={y + 43}>
        {n.id}
      </text>
    </g>
  )
}

function markers(e: SysEdge) {
  const id = e.kind === 'call' ? 'url(#arrow-call)' : 'url(#arrow-message)'
  return { markerEnd: id, markerStart: e.both ? id : undefined }
}

/* ---------- Desktop map ---------- */

function routeMap(nodes: SysNode[], edges: SysEdge[]): Drawn[] {
  const at = (id: string) => {
    const n = nodes.find((k) => k.id === id)!
    return { n, x: n.lane * LANE, y: n.row * ROW }
  }
  const zCount = new Map<string, number>()
  return edges.map((e) => {
    const a = at(e.from)
    const b = at(e.to)
    const acy = a.y + H / 2
    const bcy = b.y + H / 2
    const dLane = b.n.lane - a.n.lane
    const dRow = b.n.row - a.n.row

    if (dRow === 0 && Math.abs(dLane) === 1) {
      const x1 = dLane > 0 ? a.x + W : a.x
      const x2 = dLane > 0 ? b.x : b.x + W
      return { d: `M${x1} ${acy}H${x2}`, lx: (x1 + x2) / 2, ly: acy - 6, anchor: 'middle' }
    }
    if (dLane === 0 && Math.abs(dRow) === 1) {
      const cx = a.x + W / 2
      const y1 = dRow > 0 ? a.y + H : a.y
      const y2 = dRow > 0 ? b.y : b.y + H
      return { d: `M${cx} ${y1}V${y2}`, lx: cx + 7, ly: (y1 + y2) / 2 + 4, anchor: 'start' }
    }
    if (Math.abs(dLane) === 1) {
      const dir = dLane > 0 ? 1 : -1
      const key = `${Math.min(a.n.lane, b.n.lane)}`
      const k = zCount.get(key) ?? 0
      zCount.set(key, k + 1)
      const x1 = dir > 0 ? a.x + W : a.x
      const x2 = dir > 0 ? b.x : b.x + W
      const tx = x1 + dir * [84, 63, 105][k % 3]
      const py = acy + 14 * Math.sign(dRow)
      const ty = bcy - 14 * Math.sign(dRow)
      return {
        d: `M${x1} ${py}H${tx}V${ty}H${x2}`,
        ...(Math.abs(dRow) > 1
          ? { lx: x1 + 14 * dir, ly: py - 6, anchor: dir > 0 ? ('start' as const) : ('end' as const) }
          : { lx: tx + 7, ly: (py + ty) / 2 + 4, anchor: 'start' as const }),
      }
    }
    throw new Error(`No route for ${e.from} to ${e.to}`)
  })
}

function DesktopMap({ sys, active, titleId }: { sys: System; active: Set<string>; titleId: string }) {
  const rows = Math.max(...sys.nodes.map((n) => n.row)) + 1
  const height = ROW * rows - 42
  const drawn = routeMap(sys.nodes, sys.edges)
  const any = active.size > 0
  return (
    <svg
      className={any ? 'sysmap sysmap--wide has-active' : 'sysmap sysmap--wide'}
      width={1148}
      height={height}
      viewBox={`0 0 1148 ${height}`}
      role="img"
      aria-labelledby={titleId}
    >
      <g transform="translate(0.5 0.5)">
        {sys.edges.map((e, i) => (
          <path
            key={i}
            className={[
              'edge',
              e.kind === 'message' && 'edge--msg',
              active.has(e.from) && active.has(e.to) && 'is-on',
            ]
              .filter(Boolean)
              .join(' ')}
            d={drawn[i].d}
            {...markers(e)}
          />
        ))}
        {sys.nodes.map((n) => (
          <NodeShape key={n.id} n={n} b={{ x: n.lane * LANE, y: n.row * ROW, w: W, h: H }} on={active.has(n.id)} />
        ))}
        {sys.edges.map((e, i) => (
          <text
            key={i}
            className={active.has(e.from) && active.has(e.to) ? 'edge-label is-on' : 'edge-label'}
            x={drawn[i].lx}
            y={drawn[i].ly}
            textAnchor={drawn[i].anchor}
          >
            {e.label}
          </text>
        ))}
      </g>
    </svg>
  )
}

/* ---------- Rail (below 1260px) ---------- */

const RW = 224
const PITCH = 84

function routeRail(nodes: SysNode[], edges: SysEdge[]): Drawn[] {
  const idx = (id: string) => nodes.findIndex((n) => n.id === id)
  const out: (Drawn | null)[] = edges.map(() => null)
  const brackets: { i: number; a: number; b: number }[] = []
  const used = new Map<string, number>()
  const labelled = new Set<string>()

  edges.forEach((e, i) => {
    const a = idx(e.from)
    const b = idx(e.to)
    if (Math.abs(a - b) === 1) {
      const down = b > a
      const y1 = down ? a * PITCH + H : a * PITCH
      const y2 = down ? b * PITCH : b * PITCH + H
      out[i] = { d: `M28 ${y1}V${y2}`, lx: 42, ly: (y1 + y2) / 2 + 4, anchor: 'start' }
    } else {
      brackets.push({ i, a, b })
    }
  })

  const tracks: [number, number][][] = [[], [], [], [], []]
  brackets
    .sort((p, q) => Math.abs(p.a - p.b) - Math.abs(q.a - q.b))
    .forEach(({ i, a, b }) => {
      const down = b > a
      const port = (node: number, side: 1 | -1) => {
        const key = `${node}:${side}`
        const k = used.get(key) ?? 0
        used.set(key, k + 1)
        return node * PITCH + H / 2 + side * (k === 0 ? 21 : 7)
      }
      const ys = port(a, down ? 1 : -1)
      const yt = port(b, down ? -1 : 1)
      const lo = Math.min(ys, yt)
      const hi = Math.max(ys, yt)
      let t = tracks.findIndex((tr) => tr.every(([l, h]) => hi < l - 7 || lo > h + 7))
      if (t < 0) t = tracks.length - 1
      tracks[t].push([lo, hi])
      const xt = 245 + 21 * t
      const first = !labelled.has(`${a}:${down}`)
      labelled.add(`${a}:${down}`)
      out[i] = {
        d: `M${RW} ${ys}H${xt}V${yt}H${RW}`,
        lx: first ? 217 : -1,
        ly: down ? a * PITCH + H + 18 : a * PITCH - 10,
        anchor: 'end',
      }
    })
  return out as Drawn[]
}

function Rail({ sys, active, titleId }: { sys: System; active: Set<string>; titleId: string }) {
  const height = PITCH * sys.nodes.length - 28
  const drawn = routeRail(sys.nodes, sys.edges)
  const any = active.size > 0
  return (
    <svg
      className={any ? 'sysmap sysmap--rail has-active' : 'sysmap sysmap--rail'}
      width={348}
      height={height}
      viewBox={`0 0 348 ${height}`}
      role="img"
      aria-labelledby={titleId}
    >
      <g transform="translate(0.5 0.5)">
        {sys.edges.map((e, i) => (
          <path
            key={i}
            className={[
              'edge',
              e.kind === 'message' && 'edge--msg',
              active.has(e.from) && active.has(e.to) && 'is-on',
            ]
              .filter(Boolean)
              .join(' ')}
            d={drawn[i].d}
            {...markers(e)}
          />
        ))}
        {sys.nodes.map((n, i) => (
          <NodeShape key={n.id} n={n} b={{ x: 0, y: i * PITCH, w: RW, h: H }} on={active.has(n.id)} />
        ))}
        {sys.edges.map((e, i) =>
          drawn[i].lx < 0 ? null : (
            <text key={i} className="edge-label" x={drawn[i].lx} y={drawn[i].ly} textAnchor={drawn[i].anchor}>
              {e.label}
            </text>
          ),
        )}
      </g>
    </svg>
  )
}

/* ---------- Legend ---------- */

function Swatch({ g }: { g: Group }) {
  return (
    <svg width={29} height={15} viewBox="0 0 29 15" aria-hidden="true">
      <g transform="translate(0.5 0.5)">
        {g === 'D' ? (
          <path className="node-line" d="M0 0H28M0 14H28" />
        ) : (
          <rect className={g === 'X' ? 'node-line node-line--ext' : 'node-line'} x={0} y={0} width={28} height={14} />
        )}
        {g === 'C' && <path className="node-line" d="M0 3H28" />}
        {g === 'A' && <rect className="node-line" x={3} y={3} width={22} height={8} />}
      </g>
    </svg>
  )
}

function Legend({ sys }: { sys: System }) {
  const groups = (['C', 'S', 'D', 'A', 'X'] as Group[]).filter((g) => sys.nodes.some((n) => n.id[0] === g))
  const kinds = (['call', 'message'] as const).filter((k) => sys.edges.some((e) => e.kind === k))
  return (
    <ul className="legend" aria-label="Key">
      {groups.map((g) => (
        <li key={g}>
          <Swatch g={g} />
          {g} {groupWord[g]}
        </li>
      ))}
      {kinds.map((k) => (
        <li key={k}>
          <svg width={43} height={9} viewBox="0 0 43 9" aria-hidden="true">
            <path
              className={k === 'message' ? 'edge edge--msg' : 'edge'}
              d="M0 4.5H42"
              markerEnd={k === 'call' ? 'url(#arrow-call)' : 'url(#arrow-message)'}
            />
          </svg>
          {k}
        </li>
      ))}
    </ul>
  )
}

export default function SystemMap({ sys, active, id }: { sys: System; active: Set<string>; id: string }) {
  const titleId = `${id}-sys-title`
  const name = (nid: string) => sys.nodes.find((n) => n.id === nid)?.label
  return (
    <div className="diagram">
      <p className="diagram__title" id={titleId}>
        <span>System</span>
        {sys.title}: what exists and what talks to what
      </p>
      <DesktopMap sys={sys} active={active} titleId={titleId} />
      <Rail sys={sys} active={active} titleId={titleId} />
      <Legend sys={sys} />
      <ul className="sr-only">
        {sys.nodes.map((n) => (
          <li key={n.id}>
            {n.id}, {n.label}, {n.sub}, {groupWord[n.id[0] as Group].toLowerCase()}
          </li>
        ))}
        {sys.edges.map((e, i) => (
          <li key={i}>
            {e.from} {name(e.from)} {e.kind === 'call' ? 'calls' : 'sends a message to'} {e.to} {name(e.to)}: {e.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Arrowheads, defined once for the whole document. */
export function MarkerSprite() {
  return (
    <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <marker
          id="arrow-call"
          viewBox="0 0 8 8"
          markerWidth={8}
          markerHeight={8}
          refX={8}
          refY={4}
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0 0.5L8 4L0 7.5Z" style={{ fill: 'var(--wash)' }} />
        </marker>
        <marker
          id="arrow-message"
          viewBox="0 0 8 8"
          markerWidth={8}
          markerHeight={8}
          refX={8}
          refY={4}
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0.5 0.5L7.5 4L0.5 7.5" style={{ fill: 'none', stroke: 'var(--wash)', strokeWidth: 1 }} />
        </marker>
      </defs>
    </svg>
  )
}
