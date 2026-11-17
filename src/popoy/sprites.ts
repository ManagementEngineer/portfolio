// Popoy's frames, composed from parts so one drawing gives many poses.
// Side view for moving, front view for resting.

export const PAL: Record<string, string> = {
  o: '#3b2412',
  g: '#e2a455',
  d: '#b9762f',
  l: '#f7dfb0',
  w: '#fffdf6',
  e: '#86a83f',
  p: '#14171a',
  n: '#e8959b',
  k: '#e8a08a',
  m: '#9a9aa6', // mouse fur
  s: '#d9d9e0', // mouse belly
  y: '#f2c230', // cheese
}

const SIDE_W = 33

// body, seen from the side; the head is pasted over the right-hand end
const SIDE_BODY = [
  "",
  "",
  "",
  "",
  "",
  "",
  ".....ooooooooooo",
  "....odddddddddddo",
  "...ogdgdgdgdgggggo",
  "...oggggggggggggggo",
  "...oggggggggggggggo",
  "...ogggggggggggggggo",
  "...ogggggggggggggggo",
  "...ogggllllllllllggo",
  "...oggllllllllllllgo",
  "....ogllllllllllllo"
]

// three tail positions: row -> pixels from the left edge
const SIDE_TAILS: Record<number, string>[] = [
  {
    "2": "oo",
    "3": "odo",
    "4": ".odo",
    "5": "..odo",
    "6": "...od"
  },
  {
    "4": "oo",
    "5": "odo",
    "6": ".odo",
    "7": "..oo"
  },
  {
    "7": "ooo",
    "8": "oddo",
    "9": ".oo"
  }
]

const SIDE_LEGS: Record<string, string[]> = {
  "a": [
    "....ogo.ogo.....ogo.ogo",
    "....ogo.ogo.....ogo.ogo",
    "...ogo...ogo...ogo...ogo",
    "...olo...olo...olo...olo",
    "...ooo...ooo...ooo...ooo"
  ],
  "p": [
    ".....ogoogo......ogoogo",
    ".....ogoogo......ogoogo",
    ".....ogoogo......ogoogo",
    ".....oloolo......oloolo",
    ".....oooooo......oooooo"
  ],
  "c": [
    "....ogo.ogo.....ogo.ogo",
    "...ogo...ogo...ogo...ogo",
    "..ogo....ogo..ogo....ogo",
    "..olo....olo..olo....olo",
    "..ooo....ooo..ooo....ooo"
  ],
  "air": [
    ".oooogo.........ogooo",
    ".olllgo.........ogllo",
    ".ooooo...........oooo",
    "",
    ""
  ]
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
const TALK = HEAD.map((r, i) => (i === 10 ? 'olllllwoooowlllllo' : i === 11 ? 'olllllwwnnwwlllllo' : r))
const HAPPY = HEAD.map((r, i) =>
  i === 6 ? 'ogggooggggggoogggo' : i === 7 ? 'oggoggoggggoggoggo' : i === 8 ? 'oggggggggggggggggo' : r,
)
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
const heads: Record<string, string[]> = {
  open: HEAD,
  shut: SHUT,
  yawn: YAWN,
  l: LOOK_L,
  r: LOOK_R,
  talk: TALK,
  happy: HAPPY,
}

/* Side view: body, tail and legs, with the same head he has when sitting. */
function side(legs: string, tail: number, head = 'open'): string[] {
  const fit = (r: string) => (r + '.'.repeat(SIDE_W)).slice(0, SIDE_W).split('')
  const rows = [...SIDE_BODY, ...SIDE_LEGS[legs]].map(fit)
  Object.entries(SIDE_TAILS[tail]).forEach(([y, t]) => {
    t.split('').forEach((c, x) => {
      if (c !== '.') rows[Number(y)][x] = c
    })
  })
  heads[head].forEach((r, y) => {
    r.split('').forEach((c, x) => {
      if (c !== '.') rows[y + 1][SIDE_W - 18 + x] = c
    })
  })
  return rows.map((r) => r.join(''))
}

/* drop: how many pixels the head sinks, used for grooming */
function front(head: string, body: 'sit' | 'flick' | 'loaf', drop = 0): string[] {
  const h = wide(heads[head])
  const b = body === 'loaf' ? LOAF : body === 'flick' ? BODY_FLICK : BODY
  const blank = '.'.repeat(21)
  return [...Array(drop).fill(blank), ...h.slice(0, h.length - drop), ...b]
}

export type FrameKey = string

// The mouse, 12 by 8, facing right.
const MOUSE: Record<string, string[]> = {
  a: [
    '............',
    '......oo....',
    '.....onno...',
    '..oooooommo.',
    '.ommmmmmmomo',
    'nommmmmmmmmn',
    'nnossssssso.',
    '.o.o....o.o.',
  ],
  b: [
    '............',
    '......oo....',
    '.....onno...',
    '..oooooommo.',
    'nommmmmmmomo',
    'nommmmmmmmmn',
    '..ossssssso.',
    '...oo..oo...',
  ],
  sit: [
    '.....oo.oo..',
    '....onnonno.',
    '....ommmmmo.',
    '....ommomon.',
    '....ommmmo..',
    '...omsssmo..',
    'n..omsssmo..',
    '.nnoooooo...',
  ],
  cheese: [
    '.....oo.oo..',
    '....onnonno.',
    '....ommmmmo.',
    '....ommomon.',
    '....ommmmoyy',
    '...omsssmmyy',
    'n..omsssmo..',
    '.nnoooooo...',
  ],
}

/* Every frame the engine can ask for, by name. */
export function rowsFor(key: FrameKey): string[] {
  const [kind, a, b, c] = key.split(':')
  if (kind === 'side') return side(a, Number(b), c || 'open')
  if (kind === 'front') return front(a, b as 'sit' | 'flick' | 'loaf')
  if (kind === 'groom') return front('shut', 'sit', Number(a))
  if (kind === 'mouse') return MOUSE[a]
  return side('a', 0)
}
