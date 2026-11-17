import { useEffect, useRef, useState } from 'react'
import { PAL, rowsFor } from '../popoy/sprites'
import { explain, stationExplain, stationSay, tour, wingman } from '../data/graphs'
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
  '.hero__graph, .method, .h2, .project, .board, .project__figs .sticker, .rules li, .code, .caps li:first-child, .xp li:first-child, .closing h2'

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
  | 'held'
  | 'gag'
  | 'trick'

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
  const mouse = useRef<HTMLCanvasElement>(null)
  const [bubble, setBubble] = useState<{ text: string; next: string | null; below: boolean; shift: number } | null>(null)
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
    const said = new Set<string>()
    let pitch: { el: Element; text: string } | null = null // what he is on his way to point at
    let spotEl: Element | null = null
    let station = -1
    let rideAt = 0
    let lastP = 0
    let pitchAt = 0

    // keep the bubble on screen: slide it sideways when he is near an edge
    const place = () => {
      const r = cv.getBoundingClientRect()
      const w = Math.min(300, window.innerWidth * 0.78)
      const want = r.left + r.width / 2 - w / 2
      const ok = Math.min(window.innerWidth - w - 10, Math.max(10, want))
      return { below: r.top < 250, shift: Math.round(ok - want) }
    }
    const speak = (text: string, ms = 5200) => {
      setBubble({ text, next: null, ...place() })
      window.setTimeout(() => setBubble((b) => (b && b.text === text ? null : b)), ms)
    }
    const spotlight = (target: Element | null) => {
      spotEl?.classList.remove('popoy-spot')
      spotEl = target
      target?.classList.add('popoy-spot')
      if (target) window.setTimeout(() => target.classList.remove('popoy-spot'), 5200)
    }
    const beltTrack = () => {
      const b = document.querySelector<HTMLElement>('.belt__track')
      return b && b.offsetParent !== null ? b : null
    }

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
      const belt = beltTrack()
      if (belt && belt !== perch && visible(belt)) return belt
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

    const leapTo = (to: Element, where?: number) => {
      const at = where ?? 0.15 + Math.random() * 0.7
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

    // ---- tricks, one per tap once he has explained the section ----
    const TRICKS = [
      { id: 'flip', ms: 720, say: 'Backflip. Inspected, approved.' },
      { id: 'spin', ms: 900, say: 'Tail. Still attached.' },
      { id: 'jump', ms: 680, say: 'I can also reach the top shelf.' },
      { id: 'roll', ms: 800, say: 'That one is for the customers.' },
      { id: 'dance', ms: 1300, say: 'Fine. One dance. Then back to work.' },
    ]
    let trick = 0
    let tricksDone = 0
    const explained = new Set<string>()

    // ---- hovering a tile: he goes over and says more about it ----
    let hoverEl: HTMLElement | null = null
    let hoverAt = 0
    let toldEl: HTMLElement | null = null
    const onOver = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.('[data-popoy]') as HTMLElement | null
      if (hit === hoverEl) return
      hoverEl = hit
      hoverAt = performance.now()
      if (!hit) toldEl = null
    }
    document.addEventListener('pointerover', onOver)

    // ---- the mouse: now and then one hops onto his ledge and he gives chase ----
    const ms = mouse.current!
    const mctx = ms.getContext('2d')!
    const phone = window.innerWidth < 700
    const forced = new URLSearchParams(window.location.search).has('mouse')
    type Gag = {
      t: number
      ending: 'A' | 'B' | 'C'
      far: number // the end of the ledge the mouse comes from, document x
      toCat: number // direction from that end toward Popoy
      stop: number // where the mouse sits up
      mx: number
      mdir: number
      alpha: number
      mark: number // when the current beat of the ending began
      beat: number
      speed: number
      startScroll: number
    }
    let gag: Gag | null = null
    let gagCount = 0
    let gagDue = forced ? 2500 : 25000
    let liveFor = 0
    let mouseAt = { mx: 0, lift: 0 }

    const drawMouse = (g: Gag, key: string, lift = 0) => {
      const sp = sprite(key)
      mctx.clearRect(0, 0, 12, 8)
      mctx.save()
      if (g.mdir < 0) {
        mctx.translate(12, 0)
        mctx.scale(-1, 1)
      }
      mctx.drawImage(sp, 0, 0)
      mctx.restore()
      ms.style.opacity = String(g.alpha)
      mouseAt = { mx: g.mx, lift }
    }

    const endGag = (then: State = 'sit') => {
      gag = null
      ms.style.opacity = '0'
      if (perch) {
        const r = rectOf(perch)
        along = Math.min(1, Math.max(0, (x - r.left - 50) / Math.max(1, r.right - r.left - 100)))
      }
      speed = 0
      idle = 0
      set(then)
    }

    const startGag = () => {
      if (!perch) return
      const r = rectOf(perch)
      const leftRoom = x - r.left
      const rightRoom = r.right - x
      const far = leftRoom > rightRoom ? r.left + 18 : r.right - 18
      const toCat = Math.sign(x - far)
      const gap = Math.abs(x - far)
      let last = ''
      try {
        last = localStorage.getItem('popoy-mouse') ?? ''
      } catch {
        /* storage unavailable */
      }
      const pool = (['A', 'B', 'C'] as const).filter((e) => e !== last)
      const ending = last === '' ? 'A' : pool[Math.floor(Math.random() * pool.length)]
      try {
        localStorage.setItem('popoy-mouse', ending)
      } catch {
        /* storage unavailable */
      }
      gag = {
        t: 0,
        ending,
        far,
        toCat,
        stop: far + toCat * Math.min(240, gap * 0.4),
        mx: far,
        mdir: toCat,
        alpha: 0,
        mark: 0,
        beat: 0,
        speed: 0,
        startScroll: window.scrollY,
      }
      gagCount += 1
      gagDue = liveFor + 90000
      set('gag')
    }

    const line = (text: string) => {
      say(text)
      window.setTimeout(() => say(null), 4200)
      if (!phone) speak(text, 4200)
    }

    /* One step of the chase. Returns what Popoy should look like this frame. */
    const stepGag = (g: Gag, dt: number, tailFrame: number) => {
      g.t += dt
      const away = -g.toCat
      const runFrame = Math.floor(g.t / 70) % 2 ? 'mouse:a' : 'mouse:b'
      const catRun = (goal: number) => {
        const left = Math.abs(goal - x)
        const top = phone ? 0.36 : 0.46
        speed += ((left < 40 ? 0.08 : top) - speed) * Math.min(1, dt / 150)
        const step = Math.min(left, speed * dt)
        dir = goal >= x ? 1 : -1
        x += dir * step
        walked += step
        const f = ['a', 'p', 'c', 'p'][Math.floor(walked / 14) % 4]
        return { key: `side:${f}:2`, lift: f === 'p' ? 1 : 0, squash: 0, there: left < 3 }
      }
      const sitLook = { key: `front:${g.mx < x ? 'l' : 'r'}:sit`, lift: 0, squash: 0 }
      const sitIdle = { key: `front:open:${tailFrame >= 2 ? 'flick' : 'sit'}`, lift: 0, squash: 0 }

      if (Math.abs(window.scrollY - g.startScroll) > 80 || !perch || !visible(perch)) {
        endGag()
        return sitIdle
      }

      // --- the setup, the same every time ---
      if (g.t < 250) {
        g.alpha = g.t / 250
        drawMouse(g, 'mouse:a', Math.round(Math.sin((g.t / 250) * Math.PI) * 10))
        return sitIdle
      }
      if (g.t < 900) {
        const tt = g.t - 250
        const running = tt % 360 < 220
        const runTime = Math.floor(tt / 360) * 220 + Math.min(220, tt % 360)
        g.alpha = 1
        g.mx = g.far + g.toCat * Math.min(Math.abs(g.stop - g.far), 0.26 * runTime)
        drawMouse(g, running ? runFrame : 'mouse:b')
        return sitIdle
      }
      if (g.t < 1600) {
        g.mx = g.stop
        drawMouse(g, 'mouse:sit')
        return g.t > 1100 ? sitLook : sitIdle // they lock eyes
      }
      if (g.t < 1720) {
        g.mdir = away
        drawMouse(g, 'mouse:b')
        return sitLook
      }

      const mouseRun = (to: number, pxPerMs: number) => {
        const left = Math.abs(to - g.mx)
        const step = Math.min(left, pxPerMs * dt)
        g.mx += Math.sign(to - g.mx) * step
        return left < 2
      }
      const fast = phone ? 0.42 : 0.52

      // --- the mouse was tapped: it bolts, and he pretends that was the plan ---
      if (g.ending === 'C' && g.beat === 9) {
        g.mdir = away
        if (mouseRun(g.far + away * 60, 0.7)) g.alpha = Math.max(0, g.alpha - dt / 150)
        drawMouse(g, runFrame)
        if (g.alpha <= 0) endGag()
        return sitLook
      }

      if (g.ending === 'A') {
        // Inspection: the mouse stops, turns, and offers cheese. He inspects it.
        const hold = g.stop + (g.far - g.stop) * 0.6
        if (g.beat === 0) {
          const there = mouseRun(hold, fast)
          drawMouse(g, there ? 'mouse:cheese' : runFrame)
          if (there) {
            g.mdir = g.toCat
            g.beat = 1
          }
          return g.t > 1750 ? catRun(hold + g.toCat * 56) : sitLook
        }
        if (g.beat === 1) {
          drawMouse(g, 'mouse:cheese')
          const c = catRun(g.mx + g.toCat * 56)
          if (c.there) {
            g.beat = 2
            g.mark = g.t
          }
          return c
        }
        if (g.beat === 2) {
          drawMouse(g, 'mouse:cheese')
          if (g.t - g.mark > 700) {
            line('Cheese passes. The mouse is not my department.')
            g.beat = 3
            g.mark = g.t
          }
          return { key: 'side:a:1', lift: 0, squash: 0 }
        }
        if (g.t - g.mark > 900) {
          g.mdir = away
          if (mouseRun(g.far + away * 50, 0.14)) g.alpha = Math.max(0, g.alpha - dt / 200)
          drawMouse(g, Math.floor(g.t / 140) % 2 ? 'mouse:a' : 'mouse:b')
          if (g.alpha <= 0) endGag()
        } else drawMouse(g, 'mouse:cheese')
        return { key: `front:open:${tailFrame >= 2 ? 'flick' : 'sit'}`, lift: 0, squash: 0 }
      }

      if (g.ending === 'B') {
        // The mouse wins: it waits near the edge, he winds up, it steps off, he pounces on nothing.
        const wait = g.far + g.toCat * 40
        if (g.beat === 0) {
          const there = mouseRun(wait, fast)
          drawMouse(g, there ? 'mouse:sit' : runFrame)
          const c = g.t > 1750 ? catRun(wait + g.toCat * 90) : { ...sitLook, there: false }
          if (there && c.there) {
            g.beat = 1
            g.mark = g.t
          }
          return c
        }
        if (g.beat === 1) {
          const w = g.t - g.mark
          if (w > 450) {
            if (mouseRun(g.far + away * 60, fast)) g.alpha = Math.max(0, g.alpha - dt / 120)
            drawMouse(g, runFrame)
          } else drawMouse(g, 'mouse:sit')
          if (w > 700) {
            g.beat = 2
            g.mark = g.t
          }
          return { key: `side:${Math.floor(w / 80) % 2 ? 'a' : 'c'}:2`, lift: 0, squash: 3 }
        }
        if (g.beat === 2) {
          g.alpha = 0
          drawMouse(g, 'mouse:b')
          const u = Math.min(1, (g.t - g.mark) / 300)
          x += away * 0.15 * dt * (u < 1 ? 1 : 0)
          if (u >= 1) {
            g.beat = 3
            g.mark = g.t
          }
          return { key: 'side:air:0', lift: Math.round(72 * u * (1 - u)), squash: 0 }
        }
        const w = g.t - g.mark
        if (w > 500 && g.beat === 3) {
          line('Missed. Do not tell him.')
          g.beat = 4
        }
        if (w > 1400) endGag()
        return { key: `front:${w < 250 ? 'l' : w < 500 ? 'r' : 'open'}:sit`, lift: 0, squash: w < 90 ? 3 : 0 }
      }

      // Out of scope: the mouse leaves the line. He stops at the edge. Not his problem.
      if (g.beat === 0) {
        if (mouseRun(g.far + away * 60, fast)) g.alpha = Math.max(0, g.alpha - dt / 150)
        drawMouse(g, runFrame)
        const c = g.t > 1750 ? catRun(g.far + g.toCat * 30) : { ...sitLook, there: false }
        if (c.there && g.alpha <= 0) {
          g.beat = 1
          g.mark = g.t
        }
        return c
      }
      if (g.t - g.mark > 400 && g.beat === 1) {
        line('It left the line. Not my problem now.')
        g.beat = 2
      }
      if (g.t - g.mark > 1300) endGag('groom')
      return { key: `front:${away < 0 ? 'l' : 'r'}:sit`, lift: 0, squash: 0 }
    }

    const tapMouse = () => {
      if (!gag) return
      gag.ending = 'C'
      gag.beat = 9
      line('I had it handled.')
    }
    ms.addEventListener('click', tapMouse)

    // ---- one frame ----
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(50, now - lastT)
      lastT = now
      if (!live || hidden) return
      since += dt
      idle += dt
      liveFor += dt

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
      let rise = 0 // how far off the ledge he is, in screen pixels
      let turn = 0 // rotation in degrees, for flips and rolls
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
        const belt = beltTrack()
        let took = false
        if (perch === belt && belt) {
          // on the conveyor he walks with the scroll and calls out each station
          const p = Number((belt.parentElement as HTMLElement).style.getPropertyValue('--p')) || 0
          if (Math.abs(p - lastP) > 0.0015) {
            dir = p > lastP ? 1 : -1
            walked += Math.abs(p - lastP) * (belt.getBoundingClientRect().width - 100)
            lastP = p
            rideAt = now
          }
          along = p
          settle()
          if (now - rideAt < 220) {
            const f = ['a', 'p', 'c', 'p'][Math.floor(walked / 9) % 4]
            lift = f === 'p' ? 1 : 0
            key = `side:${f}:${t}:${shut ? 'shut' : 'open'}`
          }
          const at = Math.min(stationSay.length - 1, Math.floor(Math.min(0.999, p) * stationSay.length))
          if (p > 0 && at !== station && now - rideAt > 260) {
            station = at
            speak(stationSay[at], 4600)
            spotlight(document.querySelectorAll('.station')[at] ?? null)
            set('talk')
            took = true
          }
        }
        // now and then, a mouse
        if (
          !took &&
          perch &&
          perch !== belt &&
          gagCount < 2 &&
          liveFor > gagDue &&
          since > (forced ? 800 : 4000) &&
          !bubbleOpen.current &&
          !hovering &&
          (!pointer || now - pointer.at > 2000) &&
          now - scrolledAt > 2000 &&
          visible(perch) &&
          (gagCount === 0 || forced || Math.random() < 0.5)
        ) {
          const r = rectOf(perch)
          if (r.right - r.left >= (phone ? 220 : 320) && Math.max(x - r.left, r.right - x) >= 180) {
            startGag()
            took = true
          } else gagDue = liveFor + 6000
        } else if (gagCount > 0 && liveFor > gagDue && !took) gagDue = liveFor + 20000
        if (!belt && !took && !bubbleOpen.current && now - scrolledAt > 350) {
          const stations = Array.from(document.querySelectorAll('.station'))
          const at = stations.findIndex((n) => n.classList.contains('is-at'))
          if (at >= 0 && at !== station && visible(stations[at])) {
            station = at
            pitch = { el: stations[at], text: stationSay[at] }
            next = stations[at]
            set('look')
            took = true
          }
        }
        if (!took && hoverEl && hoverEl !== toldEl && now - hoverAt > 420 && !bubbleOpen.current && hoverEl.dataset.popoy) {
          toldEl = hoverEl
          const text = hoverEl.dataset.popoy
          const wide = hoverEl.getBoundingClientRect().width >= 170
          if (wide && visible(hoverEl) && perch !== hoverEl && perch !== belt) {
            pitch = { el: hoverEl, text }
            next = hoverEl
            set('look')
          } else {
            speak(text)
            spotlight(hoverEl)
            set('talk')
          }
          took = true
        }
        // his pitch for this part of the page: go and point at the next thing worth reading
        if (!took && perch !== belt && !bubbleOpen.current && now - scrolledAt > 900 && now - pitchAt > 2600) {
          const id = currentStop()
          const line = (wingman[id] ?? []).find((w) => !said.has(id + w.sel))
          const target = line ? document.querySelector(line.sel) : null
          if (line && target && visible(target)) {
            said.add(id + line.sel)
            pitch = { el: target, text: line.say }
            pitchAt = now
            if (perch === target) {
              speak(line.say)
              spotlight(target)
              pitch = null
              set('talk')
            } else {
              next = target
              set('look')
            }
            took = true
          }
        }
        if (took) {
          /* a pitch or a station call has taken over */
        } else if (hovering) {
          set('pet')
        } else if (perch && !visible(perch) && now - scrolledAt > 140) {
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
          if (pitch && perch === pitch.el) {
            speak(pitch.text)
            spotlight(pitch.el)
            pitch = null
            set('talk')
          } else set('sit')
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
        rise = 72 * u * (1 - u)
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
      } else if (state === 'gag') {
        if (!gag) set('sit')
        else {
          const o = stepGag(gag, dt, tail)
          key = o.key
          lift = o.lift > 3 ? 0 : o.lift
          rise = o.lift > 3 ? o.lift : 0
          squash = o.squash
        }
      } else if (state === 'trick') {
        // a trick, on request
        settle()
        const tr = TRICKS[trick]
        const u = Math.min(1, since / tr.ms)
        idle = 0
        if (tr.id === 'flip') {
          rise = 4 * 84 * u * (1 - u)
          turn = -360 * u * dir
          key = 'side:air:1'
        } else if (tr.id === 'spin') {
          dir = Math.floor(since / 110) % 2 ? 1 : -1
          key = `side:${['a', 'p', 'c', 'p'][Math.floor(since / 60) % 4]}:${Math.floor(since / 110) % 3}`
        } else if (tr.id === 'jump') {
          rise = 4 * 120 * u * (1 - u)
          key = u < 0.5 ? 'side:air:0' : 'side:air:2'
        } else if (tr.id === 'roll') {
          turn = 360 * u * dir
          rise = 10
          key = 'front:shut:loaf'
        } else {
          rise = Math.floor(since / 120) % 2 ? 12 : 0
          key = `front:happy:${Math.floor(since / 120) % 2 ? 'flick' : 'sit'}`
          if (now - heartAt > 260) {
            heartAt = now
            heart()
          }
        }
        if (u >= 1) set('land')
      } else if (state === 'held') {
        // picked up: he dangles and kicks until you let go
        key = `side:${Math.floor(since / 130) % 2 ? 'air' : 'c'}:${t}`
        lift = Math.floor(since / 260) % 2
        idle = 0
      } else if (state === 'startle') {
        settle()
        key = 'front:open:sit'
        rise = since < 120 ? 16 : since < 220 ? 6 : 0
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
      const tx = Math.round(x / PX) * PX - (W * PX) / 2
      const ty = Math.round(y / PX) * PX - H * PX + PX - Math.round(rise)
      cv.style.rotate = turn ? `${Math.round(turn)}deg` : ''
      el.style.transform = `translate(${tx}px, ${ty}px)`
      // the mouse lives inside his wrapper, so place it relative to him
      if (gag) {
        ms.style.transform = `translate(${Math.round(mouseAt.mx / PX) * PX - 6 * PX - tx}px, ${
          Math.round(y / PX) * PX - 8 * PX + PX - mouseAt.lift - ty
        }px)`
      }
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

    // the inspection is being replayed: he goes back to the board
    const hold = () => {
      if (gag) endGag()
      live = false
      el.style.opacity = '0'
      perch = null
      setBubble(null)
      document.documentElement.classList.remove('popoy-loose')
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
    // pick him up and carry him; let go and he jumps to the nearest ledge
    let grab: { x: number; y: number; moved: boolean } | null = null
    const onDown = (e: PointerEvent) => {
      if (!live) return
      grab = { x: e.clientX, y: e.clientY, moved: false }
      cv.setPointerCapture(e.pointerId)
    }
    const onDrag = (e: PointerEvent) => {
      if (!grab) return
      if (!grab.moved && Math.hypot(e.clientX - grab.x, e.clientY - grab.y) > 7) {
        grab.moved = true
        if (gag) endGag()
        perch = null
        jump = null
        setBubble(null)
        speak('Fine. Carry me.', 2200)
        set('held')
      }
      if (grab.moved) {
        x = e.clientX + window.scrollX
        y = e.clientY + window.scrollY + (H * PX) / 2
      }
    }
    const onUp = (e: PointerEvent) => {
      if (!grab) return
      const moved = grab.moved
      grab = null
      if (cv.hasPointerCapture(e.pointerId)) cv.releasePointerCapture(e.pointerId)
      if (!moved) return onTap()
      // nearest ledge to where he was dropped
      const best = Array.from(document.querySelectorAll(PERCHES))
        .filter(visible)
        .map((el2) => {
          const r = rectOf(el2)
          const cx = Math.min(r.right - 50, Math.max(r.left + 50, x))
          return { el2, r, cx, d: Math.hypot(cx - x, r.top - y) }
        })
        .sort((a, b) => a.d - b.d)[0]
      if (best) {
        leapTo(best.el2, (best.cx - best.r.left - 50) / Math.max(1, best.r.right - best.r.left - 100))
        set('air')
      } else set('sit')
    }

    // a tap: he explains the part of the page you are on
    const onTap = () => {
      if (!live) return
      if (gag) endGag()
      const id = currentStop()
      if (explained.has(id) && (state === 'sit' || state === 'talk' || state === 'pet')) {
        // he has said his piece here: now he does tricks
        trick = tricksDone % TRICKS.length
        tricksDone += 1
        setBubble(null)
        const text = TRICKS[trick].say
        say(text)
        window.setTimeout(() => say(null), 2600)
        set('trick')
        return
      }
      explained.add(id)
      const i = tour.findIndex((s) => s.id === id)
      const after = tour[i + 1]
      const st = perch === beltTrack() ? station : -1
      const text = id === 'range' && st >= 0 ? stationExplain[st] : (explain[id] ?? tour[i].say)
      setBubble({ text, next: after ? after.id : null, ...place() })
      say(null)
      heart()
      set('talk')
    }
    const onVisibility = () => {
      if (document.hidden && gag) endGag()
      lastT = performance.now()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('popoy:release', release)
    window.addEventListener('popoy:hold', hold)
    window.addEventListener('popoy:quiet', onQuiet)
    document.addEventListener('visibilitychange', onVisibility)
    const onKeyClick = (e: MouseEvent) => {
      if (e.detail === 0) onTap() // keyboard activation only; pointers go through onUp
    }
    cv.addEventListener('click', onKeyClick)
    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointermove', onDrag)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointercancel', onUp)
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
      window.removeEventListener('popoy:hold', hold)
      window.removeEventListener('popoy:quiet', onQuiet)
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('pointerover', onOver)
      ms.removeEventListener('click', tapMouse)
      cv.removeEventListener('click', onKeyClick)
      cv.removeEventListener('pointerdown', onDown)
      cv.removeEventListener('pointermove', onDrag)
      cv.removeEventListener('pointerup', onUp)
      cv.removeEventListener('pointercancel', onUp)
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
        <div
          className={bubble.below ? 'cat__bubble cat__bubble--below' : 'cat__bubble'}
          style={{ '--shift': `${bubble.shift}px` } as React.CSSProperties}
          role="status"
        >
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
      <canvas ref={mouse} className="mouse" width={12} height={8} style={{ width: 12 * px, height: 8 * px }} aria-hidden="true" />
      <canvas
        ref={canvas}
        width={W}
        height={H}
        style={{ width: W * px, height: H * px }}
        role="button"
        tabIndex={0}
        aria-label="Popoy the cat. Stroke him, drag him somewhere, or press to hear what this part of the page is about"
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
