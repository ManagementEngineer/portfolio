import { useEffect, useState } from 'react'
import { person } from '../data/site'
import { Link } from '../router'

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
            AI engineer · {person.location}
          </span>
        </div>
        <nav className="head__nav" aria-label="Sections">
          <Link to="/#work">Work</Link>
          <Link to="/#decisions">Decisions</Link>
          <Link to="/#how">Agents</Link>
          <Link to="/#stack">Stack</Link>
          <Link to="/#history">Experience</Link>
          <a href={person.resume}>Resume (PDF)</a>
          <button type="button" className="head__theme" onClick={flip}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
    </header>
  )
}
