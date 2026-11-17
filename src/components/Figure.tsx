import type { Fig } from '../data/home'

/* A number never renders without what it counts, its window and its source. */
export default function Figure({ fig }: { fig: Fig }) {
  if (!fig.window) return null
  return (
    <figure className="figure">
      <p className="figure__value">{fig.value}</p>
      <figcaption>
        <span className="figure__what">{fig.what}</span>
        <span className="figure__key">{fig.window}</span>
        <span className="figure__key">{fig.source}</span>
      </figcaption>
    </figure>
  )
}
