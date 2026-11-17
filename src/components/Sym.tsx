import type { Lane } from '../data/site'

/* The five flow-process-chart symbols used by the decision log. */
export default function Sym({ lane, on = false, size = 14 }: { lane: Lane; on?: boolean; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 14 14',
    className: on ? 'sym sym--on' : 'sym',
    'aria-hidden': true,
  } as const
  switch (lane) {
    case 'shipped':
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="5.5" />
        </svg>
      )
    case 'measured':
      return (
        <svg {...common}>
          <rect x="1.5" y="1.5" width="11" height="11" />
        </svg>
      )
    case 'held':
      return (
        <svg {...common}>
          <path d="M2.5 1.5H7A5.5 5.5 0 0 1 7 12.5H2.5Z" />
        </svg>
      )
    case 'killed':
      return (
        <svg {...common}>
          <path d="M1.5 2.5H12.5L7 12.5Z" />
        </svg>
      )
    case 'reversed':
      return (
        <svg {...common}>
          <path d="M1.5 5H7.5V2L13 7L7.5 12V9H1.5Z" />
        </svg>
      )
  }
}
