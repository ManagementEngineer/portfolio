import type { Pos } from '../data/profile'

// FantasyPros position badge: solid color chip with ink text.
const colors: Record<Pos, string> = {
  QB: 'var(--pos-qb)',
  RB: 'var(--pos-rb)',
  WR: 'var(--pos-wr)',
  TE: 'var(--pos-te)',
  K: 'var(--pos-k)',
  DST: 'var(--pos-dst)',
}

const tints: Record<Pos, string> = {
  QB: 'var(--pos-qb-tint)',
  RB: 'var(--pos-rb-tint)',
  WR: 'var(--pos-wr-tint)',
  TE: 'var(--pos-te-tint)',
  K: 'var(--pos-k-tint)',
  DST: 'var(--pos-dst-tint)',
}

export function posTint(pos: Pos) {
  return tints[pos]
}

export default function PositionBadge({ pos, text }: { pos: Pos; text?: string }) {
  return (
    <span className="pos-badge" style={{ background: colors[pos] }}>
      {text ?? pos}
    </span>
  )
}
