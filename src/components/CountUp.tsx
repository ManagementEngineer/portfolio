import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

// Animates "6,000+" style strings by counting the numeric part up on first view.
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()

  const match = value.match(/[\d,.]+/)
  const target = match ? parseFloat(match[0].replace(/,/g, '')) : null
  const decimals = match && match[0].includes('.') ? match[0].split('.')[1].length : 0

  useEffect(() => {
    const el = ref.current
    if (!el || target === null) return
    if (!inView) return
    if (reduced) {
      el.textContent = value
      return
    }
    const [prefix, suffix] = value.split(match![0])
    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix
      },
    })
    return () => controls.stop()
  }, [inView, reduced, target, value, decimals, match])

  return (
    <span ref={ref} className="num">
      {target === null || reduced ? value : '0'}
    </span>
  )
}
