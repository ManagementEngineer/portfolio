import { Suspense, lazy, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { profile, heroStats } from '../data/profile'
import PlayerCard from './PlayerCard'
import CountUp from './CountUp'

const LotteryBalls = lazy(() => import('./LotteryBalls'))

export default function Hero() {
  const reduced = useReducedMotion()
  const [showCanvas, setShowCanvas] = useState(false)

  // Mount the 3D scene only after first paint, and never for reduced motion
  // or touch-only devices — the DOM hero must own LCP.
  useEffect(() => {
    if (reduced || matchMedia('(hover: none)').matches) return
    const idle = 'requestIdleCallback' in window
    const id = idle ? requestIdleCallback(() => setShowCanvas(true)) : window.setTimeout(() => setShowCanvas(true), 300)
    return () => (idle ? cancelIdleCallback(id) : clearTimeout(id))
  }, [reduced])

  return (
    <header className="hero" id="overall">
      {showCanvas && (
        <Suspense fallback={null}>
          <LotteryBalls />
        </Suspense>
      )}

      <div className="wrap hero__grid">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="hero__ecr-line">
            <span className="hero__ecr-chip">ECR #1</span> at Sr. Product Manager (Fantasy Sports)
          </p>
          <h1 className="hero__title">{profile.headline}</h1>
          <p className="hero__summary">{profile.summary}</p>

          <div className="hero__stats">
            {heroStats.map((s) => (
              <div key={s.label} className="hero__stat">
                <span className="hero__stat-value">
                  <CountUp value={s.value} />
                </span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <p className="hero__fresh num">Latest ECR: updated just now · Std Dev 0.0 — the experts agree</p>
        </motion.div>

        <motion.div
          className="hero__card-col"
          initial={reduced ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <PlayerCard />
        </motion.div>
      </div>
    </header>
  )
}
