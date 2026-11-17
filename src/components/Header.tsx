import { person } from '../data/site'
import { Link } from '../router'

export default function Header() {
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
        <a className="head__cta" href={person.resume}>
          Resume
        </a>
      </nav>
    </header>
  )
}
