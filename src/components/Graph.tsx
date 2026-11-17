import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  Background,
  BaseEdge,
  EdgeLabelRenderer,
  Handle,
  Position,
  ReactFlow,
  getSmoothStepPath,
  type EdgeProps,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { GEdge, GNode, Graph as GraphData } from '../data/graphs'

/* A draggable node graph with dots travelling along every edge.
   Built on React Flow. Nodes can be picked up and moved. */

const Active = createContext<Set<string>>(new Set())

const sides = [
  ['t', Position.Top],
  ['r', Position.Right],
  ['b', Position.Bottom],
  ['l', Position.Left],
] as const

function ChipNode({ id, data }: NodeProps) {
  const active = useContext(Active)
  const n = data as unknown as GNode
  const state = active.size === 0 ? '' : active.has(id) ? ' is-on' : ' is-dim'
  return (
    <div className={`gnode gnode--${n.kind}${state}`}>
      {sides.map(([key, pos]) => (
        <span key={key}>
          <Handle type="source" id={`s${key}`} position={pos} isConnectable={false} />
          <Handle type="target" id={`t${key}`} position={pos} isConnectable={false} />
        </span>
      ))}
      <span className="gnode__label">{n.label}</span>
      {n.sub && <span className="gnode__sub">{n.sub}</span>}
      {n.chips && (
        <span className="gnode__chips">
          {n.chips.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </span>
      )}
    </div>
  )
}

function SparkEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, source, target }: EdgeProps) {
  const active = useContext(Active)
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 14,
  })
  const d = data as { label?: string; dashed?: boolean; i: number } | undefined
  const dim = active.size > 0 && !(active.has(source) && active.has(target))
  const dur = 2.4 + ((d?.i ?? 0) % 3) * 0.5
  return (
    <g className={dim ? 'gedge is-dim' : 'gedge'}>
      <path d={path} className="gedge__belt" />
      <BaseEdge id={id} path={path} className={d?.dashed ? 'gedge__line gedge__line--dashed' : 'gedge__line'} />
      <rect className="gedge__dot" x={-5} y={-5} width={10} height={10} rx={2}>
        <animateMotion
          dur={`${dur}s`}
          repeatCount="indefinite"
          path={path}
          rotate="auto"
          begin={`${((d?.i ?? 0) % 5) * 0.35}s`}
        />
      </rect>
      {d?.label && (
        <EdgeLabelRenderer>
          <span
            className={dim ? 'gedge__label is-dim' : 'gedge__label'}
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {d.label}
          </span>
        </EdgeLabelRenderer>
      )}
    </g>
  )
}

const nodeTypes = { chip: ChipNode }
const edgeTypes = { spark: SparkEdge }

function handles(a: GNode, b: GNode, apart = 1, side = 0) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  // stacked in one column but not neighbours: go around the side, like a bracket
  if (Math.abs(dx) < 10 && apart > 1) return side % 2 ? ['sl', 'tl'] : ['sr', 'tr']
  if (Math.abs(dx) >= Math.abs(dy) * 0.8) return dx >= 0 ? ['sr', 'tl'] : ['sl', 'tr']
  return dy >= 0 ? ['sb', 'tt'] : ['st', 'tb']
}

/* On a narrow screen the same graph is laid out again to fit the width:
   a system becomes two columns read left to right, top to bottom;
   an agent line becomes one column read top to bottom. */
function relayout(graph: GraphData, mode: 'grid' | 'column'): GraphData {
  if (mode === 'grid') {
    const order = [...graph.nodes].sort((p, q) => p.y - q.y || p.x - q.x)
    const nodes = order.map((n, i) => ({ ...n, x: (i % 2) * 184, y: Math.floor(i / 2) * 104 }))
    return { ...graph, nodes, height: Math.ceil(nodes.length / 2) * 104 + 20 }
  }
  let y = 0
  const nodes = graph.nodes.map((n) => {
    const placed = { ...n, x: 0, y }
    y += n.chips ? 86 + Math.ceil(n.chips.length / 2) * 24 : 84
    return placed
  })
  return { ...graph, nodes, height: y + 10 }
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 700px)').matches)
  useEffect(() => {
    const q = window.matchMedia('(max-width: 700px)')
    const on = () => setNarrow(q.matches)
    q.addEventListener('change', on)
    return () => q.removeEventListener('change', on)
  }, [])
  return narrow
}

export default function Graph({
  graph: wide,
  active,
  label,
  narrowLayout,
}: {
  graph: GraphData
  active?: Set<string>
  label: string
  narrowLayout?: 'grid' | 'column'
}) {
  const narrow = useNarrow() && narrowLayout !== undefined
  const graph = useMemo(() => (narrow && narrowLayout ? relayout(wide, narrowLayout) : wide), [wide, narrow, narrowLayout])
  const nodes = useMemo(
    () =>
      graph.nodes.map((n) => ({
        id: n.id,
        type: 'chip',
        position: { x: n.x, y: n.y },
        data: n as unknown as Record<string, unknown>,
      })),
    [graph],
  )
  const edges = useMemo(
    () =>
      graph.edges.map((e: GEdge, i) => {
        const a = graph.nodes.find((n) => n.id === e.from)!
        const b = graph.nodes.find((n) => n.id === e.to)!
        const apart = Math.abs(graph.nodes.indexOf(a) - graph.nodes.indexOf(b))
        const [sourceHandle, targetHandle] = handles(a, b, apart, i)
        return {
          id: `${e.from}-${e.to}`,
          source: e.from,
          target: e.to,
          sourceHandle,
          targetHandle,
          type: 'spark',
          data: { label: e.label, dashed: e.dashed, i },
        }
      }),
    [graph],
  )

  return (
    <Active.Provider value={active ?? new Set()}>
      <div
        className={narrow ? `graph graph--narrow graph--${narrowLayout}` : 'graph'}
        style={{ height: graph.height }}
        role="img"
        aria-label={label}
      >
        <ReactFlow
          key={narrow ? 'narrow' : 'wide'}
          defaultNodes={nodes}
          defaultEdges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: narrow ? 0.04 : 0.08 }}
          minZoom={0.3}
          maxZoom={1.2}
          nodesDraggable={!narrow}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
        >
          <Background gap={28} size={1.4} />
        </ReactFlow>
      </div>
    </Active.Provider>
  )
}
