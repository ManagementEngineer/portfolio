import { createContext, useContext, useMemo } from 'react'
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

function handles(a: GNode, b: GNode) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dx) >= Math.abs(dy) * 0.8) return dx >= 0 ? ['sr', 'tl'] : ['sl', 'tr']
  return dy >= 0 ? ['sb', 'tt'] : ['st', 'tb']
}

export default function Graph({
  graph,
  active,
  label,
}: {
  graph: GraphData
  active?: Set<string>
  label: string
}) {
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
        const [sourceHandle, targetHandle] = handles(a, b)
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
      <div className="graph" style={{ height: graph.height }} role="img" aria-label={label}>
        <ReactFlow
          defaultNodes={nodes}
          defaultEdges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          minZoom={0.3}
          maxZoom={1.2}
          nodesDraggable
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
