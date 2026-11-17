import { useEffect, useRef, useState } from 'react'
import { PAL, rowsFor } from '../popoy/sprites'
import { explain, tour } from '../data/graphs'
import { say } from '../guide'

/* Popoy, the star of the page, loose on it.
   He lives on the top edges of things (headings, cards, boards), in document
   coordinates so he scrolls with what he sits on. When his perch leaves the
   screen he looks, crouches and jumps to one in view. He trots or runs toward
   the pointer and pounces when it stops. Stroke him and he purrs; tap him and
   he explains the part of the page you are on. Left alone he looks around,
   grooms, yawns, loafs and sleeps. One canvas, one animation loop. */

const W = 33
const H = 26
const PERCHES =
  '.hero__graph, .method, .h2, .station, .project__head h3, .board, .project__figs .sticker, .rules li, .code, .caps li:first-child, .xp li:first-child, .closing h2'

type State =
  | 'sit'
  | 'look'
  | 'walk'
  | 'crouch'
  | 'air'
  | 'land'
  | 'groom'
  | 'yawn'
  | 'loaf'
  | 'sleep'
  | 'startle'
  | 'pet'
  | 'talk'
  | 'wiggle'
  | 'hop'

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

function currentStop(): string {
  const mid = window.innerHeight * 0.55
  let id = tour[0].id
  tour.forEach((s) => {
    const el = document.getElementById(s.id)
    if (el && el.getBoundingClientRect().top < mid) id = s.id
  })
  return id
}

export default function Cat() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const zzz = useRef<HTMLSpanElement>(null)
  const [bubble, setBubble] = useState<{ text: string; next: string | null } | null>(null)
  const bubbleOpen = useRef(false)
  const [px, setPx] = useState(4)

  useEffect(() => {
    const fit = () => setPx(window.innerWidth < 900 ? 3 : 4)
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    bubbleOpen.current = bubble !== null
  }, [bubble])

  useEffect(() => {
    const el = wrap.current
    const cv = canvas.current
    if (!el || !cv) return
    const ctx = cv.getContext('2d')!
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const PX = px

    // ---- world state, in document coordinates (feet, bottom centre) ----
    let x = 0
    let y = 0
    let dir = 1
    let state: State = 'sit'
    let since = 0
    let perch: Element | null = null
    let along = 0.5
    let speed = 0
    let walked = 0
    let goal: number | null = null
    let running = false
    let jump: { x0: number; y0: number; ms: number; to: Element; at: number } | null = null
    let next: Element | null = null
    let idle = 0
    let tail = 0
    let tailClock = 0
    let blink = 0
    let nextBlink = 2500
    let glance: 'open' | 'l' | 'r' = 'open'
    let glanceAt = 4000
    let live = false
    let hidden = false
    let pointer: { x: number; y: number; at: number; still: number } | null = null
    let hovering = false
    let heartAt = 0
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
      // on a section heading he sits on the yellow lane line, clear of the letters
      if (p.classList.contains('h2')) {
        top = r.bottom - 10 - 0.12 * parseFloat(getComputedStyle(p).fontSize)
        left = r.left + r.width * 0.62
      }
      return { left: left + window.scrollX, right: r.right + window.scrollX, top: top + window.scrollY }
    }

    const visible = (p: Element) => {
      const r = p.getBoundingClientRect()
      return r.top > 110 && r.top < window.innerHeight - 110 && r.width > 100
    }

    const pickPerch = (): Element | null => {
      const mid = window.innerHeight * 0.45
      return (
        Array.from(document.querySelectorAll(PERCHES))
          .filter((p) => p !== perch && visible(p))
          .sort((a, b) => Math.abs(a.getBoundingClientRect().top - mid) - Math.abs(b.getBoundingClientRect().top - mid))[0] ??
        null
      )
    }

    const spot = (p: Element, at: number) => {
      const r = rectOf(p)
      return { x: r.left + 50 + Math.max(1, r.right - r.left - 100) * at, y: r.top }
    }

    const leapTo = (to: Element) => {
      const at = 0.15 + Math.random() * 0.7
      const s = spot(to, at)
      const dist = Math.hypot(s.x - x, s.y - y)
      jump = { x0: x, y0: y, ms: Math.min(820, Math.max(400, dist * 0.9)), to, at }
      dir = s.x >= x ? 1 : -1
    }

    const settle = () => {
      if (!perch) return
      const s = spot(perch, along)
      x = s.x
      y = s.y
    }

    const wake = () => {
      idle = 0
      if (state === 'sleep' || state === 'loaf' || state === 'yawn' || state === 'groom') set('startle')
    }

    const heart = () => {
      const h = document.createElement('span')
      h.className = 'cat__heart'
      h.textContent = '♥'
      h.style.left = `${30 + Math.random() * 40}%`
      el.appendChild(h)
      window.setTimeout(() => h.remove(), 1100)
    }

    // ---- one frame ----
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(50, now - lastT)
      lastT = now
      if (!live || hidden) return
      since += dt
      idle += dt

      // secondary motion never stops
      tailClock += dt
      if (tailClock > (tail % 2 ? 150 : 340)) {
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
      const near = pointer && now - pointer.at < 2500 ? pointer : null
      const px = near ? near.x + window.scrollX : 0
      const py = near ? near.y + window.scrollY : 0

      if (state === 'sit') {
        settle()
        // an idle glance now and then, so he is never a statue
        if (idle > glanceAt) {
          glance = glance === 'open' ? (Math.random() < 0.5 ? 'l' : 'r') : 'open'
          glanceAt = idle + (glance === 'open' ? 2500 + Math.random() * 3000 : 700)
        }
        const eyes = near ? (px < x - 60 ? 'l' : px > x + 60 ? 'r' : 'open') : glance
        key = `front:${shut ? 'shut' : eyes}:${tail >= 2 ? 'flick' : 'sit'}`
        if (hovering) set('pet')
        else if (perch && !visible(perch) && now - scrolledAt > 140) {
          next = pickPerch()
          if (next) set('look')
        } else if (near && perch && since > 400 && Math.abs(py - y) < 280 && !bubbleOpen.current) {
          const r = rectOf(perch)
          const far = Math.abs(px - x)
          if (far > 110) {
            goal = Math.min(r.right - 50, Math.max(r.left + 50, px - Math.sign(px - x) * 60))
            if (Math.abs(goal - x) > 14) {
              dir = goal > x ? 1 : -1
              running = Math.abs(goal - x) > 320
              set('walk')
            }
          } else if (far > 40 && now - near.still > 900 && since > 2200) {
            dir = px > x ? 1 : -1
            set('wiggle')
          }
        } else if (idle > 24000) set('yawn')
        else if (idle > 9000 && since > 9000) set('groom')
      } else if (state === 'look') {
        settle()
        if (next) dir = spot(next, 0.5).x > x ? 1 : -1
        key = `side:a:${t}`
        if (since > 320) {
          if (next) leapTo(next)
          set('crouch')
        }
      } else if (state === 'walk') {
        if (!perch || goal === null) set('sit')
        else {
          y = rectOf(perch).top
          const left = Math.abs(goal - x)
          const top = running ? 0.46 : 0.2
          const want = left < 30 ? 0.05 : top
          speed += (want - speed) * Math.min(1, dt / 160)
          const step = Math.min(left, speed * dt)
          x += dir * step
          walked += step
          const f = ['a', 'p', 'c', 'p'][Math.floor(walked / (running ? 14 : 9)) % 4]
          lift = f === 'p' ? 1 : 0
          key = `side:${f}:${running ? 2 : t}:${shut ? 'shut' : 'open'}`
          if (left < 2) {
            const r = rectOf(perch)
            along = (x - r.left - 50) / Math.max(1, r.right - r.left - 100)
            speed = 0
            goal = null
            set('sit')
          }
        }
      } else if (state === 'crouch') {
        key = `side:a:${t}`
        squash = 3
        if (since > 160) set('air')
      } else if (state === 'air') {
        if (!jump) set('sit')
        else {
          const u = Math.min(1, since / jump.ms)
          const to = spot(jump.to, jump.at) // the landing spot moves with the page
          const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2
          const h = Math.max(50, Math.abs(to.x - jump.x0) * 0.32)
          x = jump.x0 + (to.x - jump.x0) * e
          y = jump.y0 + (to.y - jump.y0) * e - 4 * h * u * (1 - u)
          key = `side:air:${u < 0.5 ? 0 : 2}`
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
        squash = since < 90 ? 3 : 1
        if (since > 200) {
          idle = 0
          set('sit')
        }
      } else if (state === 'wiggle') {
        // the wind-up before a pounce: low, rear end shifting
        settle()
        key = `side:${Math.floor(since / 80) % 2 ? 'a' : 'c'}:2`
        squash = 3
        if (since > 520) set('hop')
      } else if (state === 'hop') {
        settle()
        const u = Math.min(1, since / 300)
        x += dir * 26 * u
        lift = Math.round(18 * 4 * u * (1 - u))
        key = 'side:air:0'
        if (u >= 1) {
          if (perch) {
            const r = rectOf(perch)
            along = Math.min(1, Math.max(0, (x - r.left - 50) / Math.max(1, r.right - r.left - 100)))
          }
          set('land')
        }
      } else if (state === 'pet') {
        settle()
        key = `front:happy:${Math.floor(since / 160) % 2 ? 'flick' : 'sit'}`
        lift = Math.floor(since / 110) % 2
        if (now - heartAt > 320) {
          heartAt = now
          heart()
        }
        idle = 0
        if (!hovering && since > 900) set('sit')
      } else if (state === 'talk') {
        settle()
        key = `front:${Math.floor(since / 150) % 2 && since < 2600 ? 'talk' : shut ? 'shut' : 'open'}:${tail >= 2 ? 'flick' : 'sit'}`
        idle = 0
        if (!bubbleOpen.current && since > 400) set('sit')
      } else if (state === 'groom') {
        settle()
        key = `groom:${[0, 1, 2, 1][Math.floor(since / 140) % 4]}`
        if (hovering) set('pet')
        else if (since > 140 * 4 * 4) set('sit')
      } else if (state === 'yawn') {
        settle()
        key = since < 300 ? 'front:shut:sit' : since < 1000 ? 'front:yawn:sit' : 'front:shut:sit'
        if (since > 1300) set('loaf')
      } else if (state === 'loaf') {
        settle()
        key = `front:${shut ? 'shut' : 'open'}:loaf`
        if (hovering) set('pet')
        else if (since > 7000) set('sleep')
      } else if (state === 'sleep') {
        settle()
        key = 'front:shut:loaf'
        lift = Math.floor(since / 900) % 2
        if (hovering) set('pet')
      } else if (state === 'startle') {
        settle()
        key = 'front:open:sit'
        lift = since < 120 ? 5 : since < 220 ? 2 : 0
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

    // he leaves the hero scene when it ends, or when you scroll past it
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
      if (bubbleOpen.current) setBubble(null)
      if (!live && window.scrollY > 140) release()
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const now = performance.now()
      const moved = pointer ? Math.hypot(e.clientX - pointer.x, e.clientY - pointer.y) : 99
      pointer = { x: e.clientX, y: e.clientY, at: now, still: moved > 6 || !pointer ? now : pointer.still }
      if (state === 'sleep') wake()
    }
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') hovering = true
    }
    const onLeave = () => {
      hovering = false
    }
    const onQuiet = (e: Event) => {
      hidden = (e as CustomEvent<boolean>).detail
      el.style.display = hidden ? 'none' : ''
    }
    // a tap: he explains the part of the page you are on
    const onTap = () => {
      if (!live) return
      const id = currentStop()
      const i = tour.findIndex((s) => s.id === id)
      const after = tour[i + 1]
      setBubble({ text: explain[id] ?? tour[i].say, next: after ? after.id : null })
      say(null)
      heart()
      set('talk')
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
    cv.addEventListener('pointerenter', onEnter)
    cv.addEventListener('pointerleave', onLeave)
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
      cv.removeEventListener('pointerenter', onEnter)
      cv.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('popoy-loose')
    }
  }, [px])

  return (
    <div className="cat" ref={wrap}>
      <span className="cat__zzz" ref={zzz} aria-hidden="true">
        z z z
      </span>
      {bubble && (
        <div className="cat__bubble" role="status">
          <p>{bubble.text}</p>
          <div className="cat__actions">
            {bubble.next && (
              <a href={`#${bubble.next}`} onClick={() => setBubble(null)}>
                Take me to the next part
              </a>
            )}
            <button type="button" onClick={() => setBubble(null)}>
              Got it
            </button>
          </div>
        </div>
      )}
      <canvas
        ref={canvas}
        width={W}
        height={H}
        style={{ width: W * px, height: H * px }}
        role="button"
        tabIndex={0}
        aria-label="Popoy the cat. Stroke him, or press to hear what this part of the page is about"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.currentTarget.click()
          }
        }}
      />
    </div>
  )
}
