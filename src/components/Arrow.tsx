export default function Arrow({ kind }: { kind: 'out' | 'on' | 'back' }) {
  const d = kind === 'out' ? 'M2 7L7 2M3 2H7V6' : kind === 'on' ? 'M1 4.5H8M5 1.5L8 4.5L5 7.5' : 'M8 4.5H1M4 1.5L1 4.5L4 7.5'
  return (
    <svg className="arrow" width={9} height={9} viewBox="0 0 9 9" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}
