import { useEffect, useRef, type ReactNode } from 'react'

/* A conveyor. A tote rides it from the first station to the last as the
   section scrolls through the viewport. Horizontal on wide screens,
   vertical on narrow ones; the position is one CSS variable. */
export default function Belt({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = (vh * 0.78 - r.top) / (r.height + vh * 0.2)
      el.style.setProperty('--p', String(Math.min(1, Math.max(0, p))))
      const stations = el.querySelectorAll<HTMLElement>('[data-station]')
      const at = Math.min(stations.length - 1, Math.floor(Math.min(0.999, Math.max(0, p)) * stations.length))
      stations.forEach((s, i) => s.classList.toggle('is-at', p > 0 && i === at))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="belt" ref={ref} aria-label={label}>
      <ol className="belt__stations">{children}</ol>
      <div className="belt__track">
        <span className="belt__tote">
          <span className="belt__box">RB</span>
        </span>
      </div>
    </div>
  )
}
