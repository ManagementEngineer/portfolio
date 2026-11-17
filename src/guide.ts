// A tiny store for what Popoy is saying right now.
// Walkthroughs push a line; clearing it hands the bubble back to the section tour.

type Listener = () => void

let line: string | null = null
const listeners = new Set<Listener>()

export function say(text: string | null) {
  line = text
  listeners.forEach((l) => l())
}

export function currentLine() {
  return line
}

export function subscribe(l: Listener) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
