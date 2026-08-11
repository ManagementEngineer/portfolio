import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import PositionBadge from './PositionBadge'

// The signature element: a holographic "1st overall" player card that tilts
// toward the pointer, with a foil sheen that tracks the light.
export default function PlayerCard() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 180, damping: 22 })
  const sy = useSpring(py, { stiffness: 180, damping: 22 })

  const rotateY = useTransform(sx, [0, 1], [-11, 11])
  const rotateX = useTransform(sy, [0, 1], [9, -9])
  const sheenX = useTransform(sx, [0, 1], ['-30%', '130%'])
  const glareX = useTransform(sx, [0, 1], ['20%', '80%'])
  const glareY = useTransform(sy, [0, 1], ['15%', '85%'])

  function onPointerMove(e: React.PointerEvent) {
    if (reduced) return
    const r = ref.current!.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }

  function onPointerLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div className="card-scene" ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <motion.div className="player-card" style={reduced ? undefined : { rotateX, rotateY }}>
        <div className="player-card__top">
          <span className="player-card__pick">1ST OVERALL</span>
          <PositionBadge pos="QB" text="SPM" />
        </div>

        <div className="player-card__jersey num">01</div>

        <div className="player-card__name">
          RJ
          <br />
          Batuigas
        </div>
        <div className="player-card__team">FREE AGENT · TORONTO</div>

        <dl className="player-card__stats">
          <div>
            <dt>Products live</dt>
            <dd className="num">4</dd>
          </div>
          <div>
            <dt>Draft seasons</dt>
            <dd className="num">4</dd>
          </div>
          <div>
            <dt>Bye week</dt>
            <dd>None</dd>
          </div>
        </dl>

        {!reduced && (
          <>
            <motion.div className="player-card__sheen" style={{ left: sheenX }} />
            <motion.div className="player-card__glare" style={{ ['--gx' as string]: glareX, ['--gy' as string]: glareY }} />
          </>
        )}
      </motion.div>
    </div>
  )
}
