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

  const other = theme === 'dark' ? 'Light' : 'Dark'

  return (
    <header className="head wrap">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Link to="/" className="head__name">
        {person.name}
      </Link>
      <nav className="head__nav" aria-label="Sections">
        <Link to="/#work">Work</Link>
        <Link to="/#agents">Agents</Link>
        <Link to="/#experience">Experience</Link>
        <Link to="/log">Log</Link>
        <a href={person.resume}>Resume</a>
      </nav>
      <button type="button" className="head__theme" onClick={flip} aria-label={`Switch to ${other.toLowerCase()} theme`}>
        {other}
      </button>
    </header>
  )
}
