import type { Fig } from '../data/site'

/* A number never renders without its window and where it came from. */
export default function Figure({ fig }: { fig: Fig }) {
  return (
    <div className="figure">
      <span className="figure__value">{fig.value}</span>
      <span className="figure__dim" aria-hidden="true" />
      <span className="figure__window">{fig.window}</span>
      <span className="figure__source">{fig.source}</span>
    </div>
  )
}
