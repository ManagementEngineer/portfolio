import type { Lane } from '../data/site'

/* The five flow-process-chart symbols. `on` fills the one that applies. */
export default function Sym({ lane, on = false, size = 16 }: { lane: Lane; on?: boolean; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    className: on ? 'sym sym--on' : 'sym',
    'aria-hidden': true,
  } as const
  switch (lane) {
    case 'shipped':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.75" />
        </svg>
      )
    case 'measured':
      return (
        <svg {...common}>
          <rect x="2.75" y="2.75" width="10.5" height="10.5" />
        </svg>
      )
    case 'held':
      return (
        <svg {...common}>
          <path d="M3.5 2.75h3.75a5.25 5.25 0 0 1 0 10.5H3.5z" />
        </svg>
      )
    case 'killed':
      return (
        <svg {...common}>
          <path d="M2.25 3.5h11.5L8 13.5z" />
        </svg>
      )
    case 'reversed':
      return (
        <svg {...common}>
          <path d="M1.75 6h7V2.75L14.5 8l-5.75 5.25V10h-7z" />
        </svg>
      )
  }
}
