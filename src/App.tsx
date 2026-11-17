import Header from './components/Header'
import { MarkerSprite } from './components/SystemMap'
import { cases } from './data/site'
import Case from './pages/Case'
import Home from './pages/Home'
import Log from './pages/Log'
import { Link, usePath, useScrollOnRoute } from './router'

function App() {
  const path = usePath().replace(/\/+$/, '') || '/'
  useScrollOnRoute(path)

  const study = cases.find((c) => `/work/${c.slug}` === path)

  return (
    <>
      <MarkerSprite />
      <Header />
      {path === '/' ? (
        <Home />
      ) : path === '/log' ? (
        <Log />
      ) : study ? (
        <Case key={study.slug} study={study} />
      ) : (
        <main className="wrap" id="main">
          <h1 className="title">There is no page at this address.</h1>
          <p className="more">
            <Link to="/">Go to the home page →</Link>
          </p>
        </main>
      )}
    </>
  )
}

export default App
