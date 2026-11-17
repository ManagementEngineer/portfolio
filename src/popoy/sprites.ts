// Popoy's frames, composed from parts so one drawing gives many poses.
// Side view for moving, front view for resting.

export const PAL: Record<string, string> = {
  o: '#3b2412',
  g: '#e2a455',
  d: '#b9762f',
  l: '#f7dfb0',
  w: '#fff3d6',
  e: '#3fae6b',
  p: '#14171a',
  n: '#c8553d',
  k: '#e8a08a',
}

const TOP = [
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

// three tail positions, patched over the first columns of rows 2 to 5
const TAILS = [
  ['oo..', 'odo.', '.odo', '..od'],
  ['....', 'oo..', 'oddo', '..od'],
  ['....', '....', 'ooo.', 'oodd'],
]

const LEGS: Record<string, string[]> = {
  a: [
    '..ogggggggggggggooooooo.....',
    '..oggllllllllllggo..........',
    '..oggoollllloogggo..........',
    '..ogo..oggo..ogo.ogo........',
    '..ooo..oooo..ooo.ooo........',
  ],
  p: [
    '..ogggggggggggggooooooo.....',
    '..oggllllllllllggo..........',
    '..oggoollllloogggo..........',
    '...ogo.ogo..ogo.ogo.........',
    '...ooo.ooo..ooo.ooo.........',
  ],
  c: [
    '..ogggggggggggggooooooo.....',
    '..oggllllllllllggo..........',
    '..ogggoolllooggggo..........',
    '...ogo.ogo.ogo..ogo.........',
    '...ooo.ooo.ooo..ooo.........',
  ],
  air: [
    '..ogggggggggggggooooooo.....',
    '..oggllllllllllggo..........',
    'ooogggoollloogggggooo.......',
    'olloooo.ooo..oooooollo......',
    'ooo................ooo......',
  ],
  paw: [
    '..ogggggggggggggoooooooooo..',
    '..oggllllllllllgggggggggllo.',
    '..oggoolllllooggooooooooooo.',
    '..ogo..oggo..ogo............',
    '..ooo..oooo..ooo............',
  ],
}

function side(legs: string, tail: number, eyesShut = false): string[] {
  const rows = [...TOP]
  TAILS[tail].forEach((t, i) => {
    rows[2 + i] = t + rows[2 + i].slice(4)
  })
  if (eyesShut) {
    rows[4] = rows[4].replace('ogepggepgo', 'oggggggggo')
    rows[5] = rows[5].replace('ogeeggeego', 'ogooggoogo')
  }
  return [...rows, ...LEGS[legs]]
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
const SHUT = [...HEAD.slice(0, 6), 'oggggggggggggggggo', 'oggooooggggooooggo', 'oggggggggggggggggo', ...HEAD.slice(9)]
const YAWN = [...SHUT.slice(0, 10), 'olllllwoooowlllllo', 'olllllwonnowlllllo', '.ollllwoooowllllo.', ...HEAD.slice(13)]
const LOOK_L = HEAD.map((r, i) => (i === 7 ? 'oggppeeggggppeeggo' : r))
const LOOK_R = HEAD.map((r, i) => (i === 7 ? 'oggeeppggggeeppggo' : r))

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
const LOAF = ['.ooollllllllllooo....', 'ogggglllllllllggggo..', 'oggggggggggggggggdoo.', '.ooooooooooooooooooo.']

const wide = (rows: string[]) => rows.map((r) => r + '...')
const heads: Record<string, string[]> = { open: HEAD, shut: SHUT, yawn: YAWN, l: LOOK_L, r: LOOK_R }

/* drop: how many pixels the head sinks, used for grooming */
function front(head: string, body: 'sit' | 'flick' | 'loaf', drop = 0): string[] {
  const h = wide(heads[head])
  const b = body === 'loaf' ? LOAF : body === 'flick' ? BODY_FLICK : BODY
  const blank = '.'.repeat(21)
  return [...Array(drop).fill(blank), ...h.slice(0, h.length - drop), ...b]
}

export type FrameKey = string

/* Every frame the engine can ask for, by name. */
export function rowsFor(key: FrameKey): string[] {
  const [kind, a, b] = key.split(':')
  if (kind === 'side') return side(a, Number(b))
  if (kind === 'sideshut') return side(a, Number(b), true)
  if (kind === 'front') return front(a, b as 'sit' | 'flick' | 'loaf')
  if (kind === 'groom') return front('shut', 'sit', Number(a))
  return side('a', 0)
}
