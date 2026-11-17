import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Popoy from './Popoy'
import { stationSay } from '../data/graphs'
import { currentLine, subscribe } from '../guide'

/* Popoy on the floor rail. He walks along the bottom of the screen as you
   move through a section, sits when you stop, and his line runs as a
   subtitle in the rail. Walkthroughs elsewhere speak through the same rail. */

export type Stop = { id: string; say: string; next?: string; hideCat?: boolean }

export default function Guide({ stops }: { stops: Stop[] }) {
  const narration = useSyncExternalStore(subscribe, currentLine)
  const [at, setAt] = useState(0)
  const [walking, setWalking] = useState(false)
  const [station, setStation] = useState(-1)
  const [quiet, setQuiet] = useState(() => {
    try {
      return localStorage.getItem('popoy') === 'quiet'
    } catch {
      return false
    }
  })
  const ref = useRef<HTMLDivElement>(null)
  const last = useRef(0)
  const idle = useRef<number | undefined>(undefined)

  useEffect(() => {
    let frame = 0
    const tops = () => stops.map((s) => document.getElementById(s.id)?.getBoundingClientRect().top ?? Infinity)
    const update = () => {
      frame = 0
      const y = window.scrollY
      const mid = window.innerHeight * 0.55
      const t = tops()
      let current = 0
      t.forEach((top, i) => {
        if (top < mid) current = i
      })
      setAt(current)
      setStation(Array.from(document.querySelectorAll('.station')).findIndex((el) => el.classList.contains('is-at')))

      // progress through the current section drives where he stands
      const start = t[current]
      const end = t[current + 1] ?? start + document.documentElement.scrollHeight
      const p = Math.min(1, Math.max(0, (mid - start) / Math.max(1, end - start)))
      ref.current?.style.setProperty('--x', String(p))

      if (Math.abs(y - last.current) > 2) {
        setWalking(true)
        window.clearTimeout(idle.current)
        idle.current = window.setTimeout(() => setWalking(false), 200)
      }
      last.current = y
    }
    let late = 0
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
      // read once more after the conveyor has moved its tote, so the station line is current
      window.clearTimeout(late)
      late = window.setTimeout(update, 90)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
      window.clearTimeout(late)
      window.clearTimeout(idle.current)
    }
  }, [stops])

  const toggle = () => {
    const next = !quiet
    setQuiet(next)
    window.dispatchEvent(new CustomEvent('popoy:quiet', { detail: next }))
    try {
      localStorage.setItem('popoy', next ? 'quiet' : 'on')
    } catch {
      /* storage unavailable */
    }
  }

  const stop = stops[at]
  const nextStop = stops[at + 1]
  const text = narration ?? (stop.id === 'range' && station >= 0 ? stationSay[station] : stop.say)

  if (quiet) {
    return (
      <button type="button" className="guide__wake" onClick={toggle} aria-label="Wake Popoy, the guide">
        <Popoy pose="head" px={2} />
        Wake Popoy
      </button>
    )
  }

  return (
    <div className={walking ? 'guide is-walking' : 'guide'} ref={ref}>
      <div className="guide__rail">
        <span className="guide__plate">Popoy</span>
        <p className="guide__line" aria-live="polite">
          {text}
        </p>
        {!narration && nextStop && (
          <a href={`#${nextStop.id}`} className="guide__next">
            {stop.next ?? 'Next'}
          </a>
        )}
        <button type="button" className="guide__quiet" onClick={toggle} aria-label="Quiet Popoy, the guide">
          Quiet
        </button>
      </div>
    </div>
  )
}
