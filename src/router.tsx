import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'

const listeners = new Set<() => void>()

export function navigate(to: string) {
  if (to === window.location.pathname + window.location.search + window.location.hash) return
  window.history.pushState(null, '', to)
  listeners.forEach((l) => l())
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    listeners.add(update)
    window.addEventListener('popstate', update)
    return () => {
      listeners.delete(update)
      window.removeEventListener('popstate', update)
    }
  }, [])
  return path
}

/* Scroll to the hash target after a route change, or to the top without one. */
export function useScrollOnRoute(path: string) {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    const el = id ? document.getElementById(id) : null
    if (el) el.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [path])
}

export function Link({
  to,
  children,
  className,
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    const [pathname, hash] = to.split('#')
    if (pathname === window.location.pathname && hash) {
      window.history.pushState(null, '', to)
      document.getElementById(hash)?.scrollIntoView()
      return
    }
    navigate(to)
  }
  return (
    <a href={to} onClick={onClick} className={className}>
      {children}
    </a>
  )
}
