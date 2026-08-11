import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

// The closer: a live draft clock. Gold is spent here and nowhere else.
export default function OnTheClock() {
  const [seconds, setSeconds] = useState(10 * 60)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s <= 0 ? 10 * 60 : s - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <footer className="clock" id="contact">
      <div className="wrap clock__inner">
        <p className="clock__label">Pick 1.01 — you're on the clock</p>
        <p className="clock__time num" role="timer" aria-label="Draft clock">
          {mm}:{ss}
        </p>
        <p className="clock__pitch">
          Still available: a PM who has lived inside rankings, start/sit, and draft-day products for four seasons — as
          the builder <em>and</em> the user.
        </p>
        <a
          className="btn-gold"
          href={`mailto:${profile.email}?subject=${encodeURIComponent('With the 1st overall pick…')}`}
        >
          Draft RJ
        </a>

        <nav className="clock__links" aria-label="Profiles">
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </nav>

        <p className="clock__fineprint">
          Built by RJ with React, Three.js, Motion, and Claude Code. Position colors lovingly borrowed — not affiliated
          with FantasyPros. Yet.
        </p>
      </div>
    </footer>
  )
}
