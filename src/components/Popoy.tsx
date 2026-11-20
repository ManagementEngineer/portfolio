import { useEffect, useState } from 'react'

/* Popoy: a golden shaded British Shorthair, drawn pixel by pixel.
   He blinks, and when he is sitting his tail flicks. */

const PAL: Record<string, string> = {
  o: '#3b2412', // outline
  g: '#e2a455', // golden coat
  d: '#b9762f', // darker tipping
  l: '#f7dfb0', // pale chest and cheeks
  w: '#fffdf6', // muzzle
  e: '#86a83f', // green eyes
  p: '#14171a', // pupils
  n: '#e8959b', // nose
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

const SIDE_TOP = [
  '...............oo...oo......',
  '..............ogko.okgo.....',
  'oo............oggooogggo....',
  'odo...........oggddddggo....',
  '.odo..........ogepggepgo....',
  '..odooooooooooogeeggeego....',
  '..oddddddddddddgllnnllgo....',
  '..ogdgdgdgdgggglwwoowwlo....',
  '..oggggggggggggglwwwwlo.....',
]

const SIDE_LEGS = [
  [
    '..ogggggggggggggooooooo.....',
    '..oggllllllllllggo..........',
    '..oggoollllloogggo..........',
    '..ogo..oggo..ogo.ogo........',
    '..ooo..oooo..ooo.ooo........',
  ],
  [
    '..ogggggggggggggooooooo.....',
    '..oggllllllllllggo..........',
    '..ogggoolllooggggo..........',
    '...ogo.ogo.ogo..ogo.........',
    '...ooo.ooo.ooo..ooo.........',
  ],
]

const SIDE_STRIKE = [
  '..ogggggggggggggoooooooooo..',
  '..oggllllllllllgggggggggllo.',
  '..oggoolllllooggooooooooooo.',
  '..ogo..oggo..ogo............',
  '..ooo..oooo..ooo............',
]

const pad = (rows: string[]) => rows.map((r) => r + '...')

export function Pixels({ rows, px }: { rows: string[]; px: number }) {
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

export type Pose = 'head' | 'sit' | 'walk' | 'side' | 'strike'

/* The pixel rows for a pose. `frame` picks the walk or tail frame. */
export function popoyRows(pose: Pose, frame = false, blink = false): string[] {
  const head = blink ? BLINK : HEAD
  if (pose === 'head') return head
  if (pose === 'walk') return [...SIDE_TOP, ...SIDE_LEGS[frame ? 1 : 0]]
  if (pose === 'side') return [...SIDE_TOP, ...SIDE_LEGS[0]]
  if (pose === 'strike') return [...SIDE_TOP, ...SIDE_STRIKE]
  return [...pad(head), ...(frame ? BODY_FLICK : BODY)]
}

export default function Popoy({
  pose,
  px = 4,
  className,
  flip = false,
}: {
  pose: Pose
  px?: number
  className?: string
  flip?: boolean
}) {
  const [blink, setBlink] = useState(false)
  const [flick, setFlick] = useState(false)

  useEffect(() => {
    let open: number | undefined
    const blinker = window.setInterval(() => {
      setBlink(true)
      open = window.setTimeout(() => setBlink(false), 170)
    }, 2900)
    const tail = window.setInterval(() => setFlick((f) => !f), pose === 'walk' ? 150 : 640)
    return () => {
      window.clearInterval(blinker)
      window.clearInterval(tail)
      window.clearTimeout(open)
    }
  }, [pose])

  const rows = popoyRows(pose, flick, blink)

  return (
    <span
      className={className ? `popoy ${className}` : 'popoy'}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      role="img" aria-label="Popoy, a golden British Shorthair cat, in pixel art">
      <Pixels rows={rows} px={px} />
    </span>
  )
}
