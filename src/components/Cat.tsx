import { useEffect, useRef } from 'react'
import { PAL, rowsFor } from '../popoy/sprites'

/* Popoy, loose on the page.
   He lives on the top edges of things (headings, cards, boards), in document
   coordinates so he scrolls with what he is sitting on. When his perch leaves
   the screen he looks, crouches and jumps to one that is in view. He trots
   toward the pointer, and when nothing happens he grooms, yawns, loafs and
   sleeps. One canvas, one animation loop, no library. */

const PX = 3
const W = 28
const H = 24
const PERCHES = '.hero__graph, .method, .h2, .station, .project__head h3, .board, .project__figs .sticker, .rules li, .code, .caps li:first-child, .xp li:first-child, .closing h2'

type State = 'sit' | 'look' | 'walk' | 'crouch' | 'air' | 'land' | 'groom' | 'yawn' | 'loaf' | 'sleep' | 'startle'

const cache = new Map<string, HTMLCanvasElement>()
function sprite(key: string): HTMLCanvasElement {
  let c = cache.get(key)
  if (c) return c
  const rows = rowsFor(key)
  c = document.createElement('canvas')
  c.width = rows[0].length
  c.height = rows.length
  const g = c.getContext('2d')!
  rows.forEach((row, y) =>
    row.split('').forEach((ch, x) => {
      if (ch === '.') return
      g.fillStyle = PAL[ch]
      g.fillRect(x, y, 1, 1)
    }),
  )
  cache.set(key, c)
  return c
}

export default function Cat() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const zzz = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = wrap.current
    const cv = canvas.current
    if (!el || !cv) return
    const ctx = cv.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    // ---- world state, in document coordinates (feet, bottom centre) ----
    let x = 0
    let y = 0
    let dir = 1
    let state: State = 'sit'
    let since = 0 // ms in the current state
    let perch: Element | null = null
    let along = 0.5 // position along the perch, 0 to 1
    let speed = 0
    let walked = 0 // px travelled, drives the walk frames
    let goal: number | null = null // target x on the perch, document coords
    let jump: { x0: number; y0: number; x1: number; y1: number; ms: number; to: Element; at: number } | null = null
    let next: Element | null = null
    let idle = 0
    let tail = 0
    let tailClock = 0
    let blink = 0
    let nextBlink = 2500
    let live = false
    let hidden = false
    let pointer: { x: number; y: number; at: number } | null = null
    let scrolledAt = 0
    let lastT = performance.now()
    let raf = 0

    const set = (s: State) => {
      state = s
      since = 0
    }

    const rectOf = (p: Element) => {
      const r = p.getBoundingClientRect()
      let top = r.top
      let left = r.left
      // a section heading: he sits on its yellow lane line, clear of the letters
      if (p.classList.contains('h2')) {
        top = r.bottom - 10 - 0.12 * parseFloat(getComputedStyle(p).fontSize)
        left = r.left + r.width * 0.62
      }
      return { left: left + window.scrollX, right: r.right + window.scrollX, top: top + window.scrollY, vt: r.top }
    }

    const visible = (p: Element) => {
      const r = p.getBoundingClientRect()
      return r.top > 96 && r.top < window.innerHeight - 110 && r.width > 80
    }

    const pickPerch = (): Element | null => {
      const all = Array.from(document.querySelectorAll(PERCHES)).filter(visible)
      if (!all.length) return null
      const mid = window.innerHeight * 0.45
      // nearest to the reading line, but never the one he is on
      return (
        all
          .filter((p) => p !== perch)
          .sort((a, b) => Math.abs(a.getBoundingClientRect().top - mid) - Math.abs(b.getBoundingClientRect().top - mid))[0] ??
        null
      )
    }

    const leapTo = (to: Element) => {
      const r = rectOf(to)
      const span = Math.max(1, r.right - r.left - 80)
      const at = 0.15 + Math.random() * 0.7
      const x1 = r.left + 40 + span * at
      const dist = Math.hypot(x1 - x, r.top - y)
      jump = { x0: x, y0: y, x1, y1: r.top, ms: Math.min(780, Math.max(380, dist * 0.9)), to, at }
      dir = x1 >= x ? 1 : -1
    }

    const settle = () => {
      if (!perch) return
      const r = rectOf(perch)
      const span = Math.max(1, r.right - r.left - 80)
      x = r.left + 40 + span * along
      y = r.top
    }

    const wake = () => {
      idle = 0
      if (state === 'sleep' || state === 'loaf' || state === 'yawn' || state === 'groom') set('startle')
    }

    // ---- one frame ----
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(50, now - lastT)
      lastT = now
      if (!live || hidden) return
      since += dt
      idle += dt

      // secondary motion never stops: tail and blink run on their own clocks
      tailClock += dt
      if (tailClock > (tail === 1 ? 150 : 340)) {
        tailClock = 0
        tail = (tail + 1) % 4
      }
      blink += dt
      if (blink > nextBlink + 90) {
        blink = 0
        nextBlink = 1800 + Math.random() * 4200
      }
      const shut = blink > nextBlink
      const t = [0, 1, 2, 1][tail]

      let key = 'front:open:sit'
      let lift = 0
      let squash = 0

      if (state === 'sit') {
        settle()
        const near = pointer && now - pointer.at < 2500 ? pointer : null
        const look = near ? (near.x + window.scrollX < x - 60 ? 'l' : near.x + window.scrollX > x + 60 ? 'r' : 'open') : 'open'
        key = `front:${shut ? 'shut' : look}:${tail >= 2 ? 'flick' : 'sit'}`
        if (perch && !visible(perch) && now - scrolledAt > 140) {
          next = pickPerch()
          if (next) set('look')
        } else if (near && perch && idle > 500) {
          const r = rectOf(perch)
          const px = near.x + window.scrollX
          const py = near.y + window.scrollY
          if (Math.abs(py - y) < 260 && Math.abs(px - x) > 90) {
            goal = Math.min(r.right - 44, Math.max(r.left + 44, px - Math.sign(px - x) * 46))
            if (Math.abs(goal - x) > 12) {
              dir = goal > x ? 1 : -1
              set('walk')
            }
          }
        } else if (idle > 22000) set('yawn')
        else if (idle > 9000 && since > 9000) set('groom')
      } else if (state === 'look') {
        // anticipation: face where he is going before he moves
        settle()
        if (next) dir = rectOf(next).left + 60 > x ? 1 : -1
        key = `side:a:${t}`
        if (since > 320) {
          if (next) leapTo(next)
          set('crouch')
        }
      } else if (state === 'walk') {
        if (!perch || goal === null) set('sit')
        else {
          const r = rectOf(perch)
          y = r.top
          const left = Math.abs(goal - x)
          const want = left < 26 ? 0.05 : 0.2
          speed += (want - speed) * Math.min(1, dt / 160)
          const step = Math.min(left, speed * dt)
          x += dir * step
          walked += step
          const f = ['a', 'p', 'c', 'p'][Math.floor(walked / 7) % 4]
          lift = f === 'p' ? 1 : 0
          key = `${shut ? 'sideshut' : 'side'}:${f}:${t}`
          if (left < 2) {
            along = (x - r.left - 40) / Math.max(1, r.right - r.left - 80)
            speed = 0
            goal = null
            set('sit')
          }
        }
      } else if (state === 'crouch') {
        key = `side:a:${t}`
        squash = 2
        if (since > 150) set('air')
      } else if (state === 'air') {
        if (!jump) set('sit')
        else {
          const u = Math.min(1, since / jump.ms)
          // the landing spot moves with the page, so re-read it as he flies
          const r = rectOf(jump.to)
          const tx = r.left + 40 + Math.max(1, r.right - r.left - 80) * jump.at
          const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2
          const h = Math.max(46, Math.abs(tx - jump.x0) * 0.32)
          x = jump.x0 + (tx - jump.x0) * e
          y = jump.y0 + (r.top - jump.y0) * e - 4 * h * u * (1 - u)
          key = `side:air:${t}`
          if (u >= 1) {
            perch = jump.to
            along = jump.at
            jump = null
            set('land')
          }
        }
      } else if (state === 'land') {
        settle()
        key = `side:a:${t}`
        squash = since < 90 ? 2 : 1
        if (since > 190) {
          idle = 0
          set('sit')
        }
      } else if (state === 'groom') {
        settle()
        key = `groom:${[0, 1, 2, 1][Math.floor(since / 140) % 4]}`
        if (since > 140 * 4 * 4) set('sit')
      } else if (state === 'yawn') {
        settle()
        key = since < 300 ? 'front:shut:sit' : since < 1000 ? 'front:yawn:sit' : 'front:shut:sit'
        if (since > 1300) set('loaf')
      } else if (state === 'loaf') {
        settle()
        key = `front:${shut ? 'shut' : 'open'}:loaf`
        if (since > 7000) set('sleep')
      } else if (state === 'sleep') {
        settle()
        key = 'front:shut:loaf'
        lift = Math.floor(since / 900) % 2 // breathing
      } else if (state === 'startle') {
        settle()
        key = 'front:open:sit'
        lift = since < 120 ? 4 : since < 220 ? 2 : 0
        if (since > 300) set('sit')
      }

      if (zzz.current) zzz.current.style.opacity = state === 'sleep' ? '1' : '0'

      // ---- draw, bottom aligned, snapped to the sprite pixel grid ----
      const s = sprite(key)
      ctx.clearRect(0, 0, W, H)
      ctx.save()
      if (dir < 0 && key.startsWith('side')) {
        ctx.translate(W, 0)
        ctx.scale(-1, 1)
      }
      const ox = Math.floor((W - s.width) / 2)
      const sh = s.height - squash
      ctx.drawImage(s, 0, 0, s.width, s.height, ox, H - sh - lift, s.width, sh)
      ctx.restore()
      el.style.transform = `translate(${Math.round(x / PX) * PX - (W * PX) / 2}px, ${Math.round(y / PX) * PX - H * PX + PX}px)`
    }

    // ---- how he arrives: he leaves the hero scene when it ends, or when you scroll past it ----
    const release = () => {
      if (live) return
      const from = document.querySelector('.hl__cat')?.getBoundingClientRect()
      x = (from ? from.left + from.width / 2 : window.innerWidth - 200) + window.scrollX
      y = (from ? from.bottom : 300) + window.scrollY
      live = true
      el.style.opacity = '1'
      document.documentElement.classList.add('popoy-loose')
      next = pickPerch() ?? document.querySelector('.h2')
      if (next) {
        leapTo(next)
        set('crouch')
      }
    }

    const onScroll = () => {
      scrolledAt = performance.now()
      wake()
      if (!live && window.scrollY > 140) release()
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      pointer = { x: e.clientX, y: e.clientY, at: performance.now() }
      if (state === 'sleep') wake()
    }
    const onQuiet = (e: Event) => {
      hidden = (e as CustomEvent<boolean>).detail
      el.style.display = hidden ? 'none' : ''
    }
    // a tap sends him on to the next thing worth looking at
    const onTap = () => {
      const all = Array.from(document.querySelectorAll(PERCHES))
      const below = all.find((p) => p.getBoundingClientRect().top > window.innerHeight * 0.6)
      if (!below) return
      window.scrollTo({ top: below.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4, behavior: 'smooth' })
    }
    const onVisibility = () => {
      lastT = performance.now()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('popoy:release', release)
    window.addEventListener('popoy:quiet', onQuiet)
    document.addEventListener('visibilitychange', onVisibility)
    cv.addEventListener('click', onTap)
    try {
      hidden = localStorage.getItem('popoy') === 'quiet'
      if (hidden) el.style.display = 'none'
    } catch {
      /* storage unavailable */
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('popoy:release', release)
      window.removeEventListener('popoy:quiet', onQuiet)
      document.removeEventListener('visibilitychange', onVisibility)
      cv.removeEventListener('click', onTap)
      document.documentElement.classList.remove('popoy-loose')
    }
  }, [])

  return (
    <div className="cat" ref={wrap} aria-hidden="true">
      <span className="cat__zzz" ref={zzz}>
        z z z
      </span>
      <canvas ref={canvas} width={W} height={H} style={{ width: W * PX, height: H * PX }} />
    </div>
  )
}
