import './App.css'
import Hero from './components/Hero'
import Board from './components/Board'
import Scheme from './components/Scheme'
import StartSit from './components/StartSit'
import GameLog from './components/GameLog'
import Eligibility from './components/Eligibility'
import OnTheClock from './components/OnTheClock'

const tabs = [
  { href: '#overall', label: 'Overall' },
  { href: '#board', label: 'The Board' },
  { href: '#scheme', label: 'Scheme' },
  { href: '#startsit', label: 'Start/Sit' },
  { href: '#gamelog', label: 'Game Log' },
  { href: '#eligibility', label: 'Eligibility' },
  { href: '#contact', label: 'Draft Ramuel' },
]

function App() {
  return (
    <>
      <nav className="tabs" aria-label="Sections">
        <div className="wrap tabs__inner">
          <a className="tabs__brand" href="#overall">
            RAMUEL<span>.01</span>
          </a>
          <div className="tabs__list">
            {tabs.map((t) => (
              <a key={t.href} href={t.href} className="tabs__tab">
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <main>
        <Hero />
        <Board />
        <Scheme />
        <StartSit />
        <GameLog />
        <Eligibility />
      </main>
      <OnTheClock />
    </>
  )
}

export default App
