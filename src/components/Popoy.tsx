import { useEffect, useState } from 'react'

/* Popoy: a golden shaded British Shorthair, drawn pixel by pixel.
   He blinks, and when he is sitting his tail flicks. */

const PAL: Record<string, string> = {
  o: '#3b2412', // outline
  g: '#e2a455', // golden coat
  d: '#b9762f', // darker tipping
  l: '#f7dfb0', // pale chest and cheeks
  w: '#fff3d6', // muzzle
  e: '#3fae6b', // green eyes
  p: '#14171a', // pupils
  n: '#c8553d', // nose
  k: '#e8a08a', // inner ear
}

const HEAD = [
  '...oo........oo...',
  '..ogdo......odgo..',
  '..ogkgoooooogkgo..',
  '.oggddddddddddggo.',
  '.ogggdgdggdgdgggo.',
  'oggggggggggggggggo',
  'oggooooggggooooggo',
  'oggeppeggggeppeggo',
  'oggeeeeggggeeeeggo',
  'ogllggggnnggggllgo',
  'olllllwwoowwlllllo',
  'olllllwwwwwwlllllo',
  '.ollllwwwwwwllllo.',
  '..oolllllllllloo..',
  '....oooooooooo....',
]

const BLINK = [
  ...HEAD.slice(0, 6),
  'oggggggggggggggggo',
  'oggooooggggooooggo',
  'oggggggggggggggggo',
  ...HEAD.slice(9),
]

const BODY = [
  '...ollllllllllo......',
  '..ogglllllllldgo.....',
  '..oggglllllldggo..oo.',
  '.oggggllllllgggo.odo.',
  '.oggggollllogggoodo..',
  '.ogggollllllogggdo...',
  '.ogggolllllloggoo....',
  '.ollloolllloolllo....',
  '.oooooooooooooooo....',
]

const BODY_FLICK = [
  BODY[0],
  '..ogglllllllldgo..oo.',
  '..oggglllllldggo.odo.',
  '.oggggllllllgggo.odo.',
  '.oggggollllogggoodo..',
  ...BODY.slice(5),
]

const pad = (rows: string[]) => rows.map((r) => r + '...')

function Pixels({ rows, px }: { rows: string[]; px: number }) {
  const w = rows[0].length
  return (
    <svg
      width={w * px}
      height={rows.length * px}
      viewBox={`0 0 ${w} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rows.map((row, y) =>
        row.split('').map((c, x) => (c === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={PAL[c]} />)),
      )}
    </svg>
  )
}

export default function Popoy({ pose, px = 4, className }: { pose: 'head' | 'sit'; px?: number; className?: string }) {
  const [blink, setBlink] = useState(false)
  const [flick, setFlick] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let open: number | undefined
    const blinker = window.setInterval(() => {
      setBlink(true)
      open = window.setTimeout(() => setBlink(false), 170)
    }, 2900)
    const tail = window.setInterval(() => setFlick((f) => !f), 640)
    return () => {
      window.clearInterval(blinker)
      window.clearInterval(tail)
      window.clearTimeout(open)
    }
  }, [])

  const head = blink ? BLINK : HEAD
  const rows = pose === 'head' ? head : [...pad(head), ...(flick ? BODY_FLICK : BODY)]

  return (
    <span className={className ? `popoy ${className}` : 'popoy'} role="img" aria-label="Popoy, a golden British Shorthair cat, in pixel art">
      <Pixels rows={rows} px={px} />
    </span>
  )
}
