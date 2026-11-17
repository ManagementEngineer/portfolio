import { useEffect, useRef, useState } from 'react'

/* Counts a figure up from zero the first time it scrolls into view.
   Anything around the number (CA$, %, commas) is kept as written. */
export default function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/)
  const target = match ? Number(match[2].replace(/,/g, '')) : NaN
  const [shown, setShown] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !match || Number.isNaN(target)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const io = new IntersectionObserver(
      (hits) => {
        if (!hits.some((h) => h.isIntersecting)) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1100)
          const eased = 1 - Math.pow(1 - t, 3)
          const n = Math.round(target * eased)
          setShown(`${match[1]}${n.toLocaleString('en-US')}${match[3]}`)
          if (t < 1) frame = requestAnimationFrame(tick)
          else setShown(value)
        }
        setShown(`${match[1]}0${match[3]}`)
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span ref={ref}>{shown}</span>
}
