import { useEffect, useState } from 'react'
import { log, person } from '../data/site'
import { Link } from '../router'

const lastEntry = log.reduce((max, e) => (e.date > max ? e.date : max), '')

function readTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const flip = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <header className="head">
      <div className="wrap head__inner">
        <div className="head__id">
          <Link to="/" className="head__name">
            {person.name}
          </Link>
          <span className="head__meta">
            {person.location} · last entry {lastEntry}
          </span>
        </div>
        <nav className="head__nav" aria-label="Sections">
          <Link to="/#work">Work</Link>
          <Link to="/#log">Log</Link>
          <Link to="/#how">How I work</Link>
          <Link to="/#history">History</Link>
          <a href={person.resume}>Resume (PDF)</a>
          <button type="button" className="head__theme" onClick={flip}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
    </header>
  )
}
