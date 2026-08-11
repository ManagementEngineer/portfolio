import { skills, type Pos } from '../data/profile'
import PositionBadge from './PositionBadge'

const groups: { pos: Pos; title: string; items: readonly string[] }[] = [
  { pos: 'QB', title: 'Product', items: skills.product },
  { pos: 'RB', title: 'Build', items: skills.build },
  { pos: 'WR', title: 'AI', items: skills.ai },
  { pos: 'TE', title: 'Fantasy', items: skills.fantasy },
]

// Skills as multi-position eligibility, keyed to the badge colors.
export default function Eligibility() {
  return (
    <section className="section eligibility-section" id="eligibility">
      <div className="wrap">
        <p className="section-kicker">Eligibility</p>
        <h2 className="section-title">Multi-position eligible</h2>
        <p className="section-sub">Start me anywhere in the lineup.</p>

        <div className="eligibility">
          {groups.map((g) => (
            <div key={g.title} className="eligibility__group">
              <p className="eligibility__head">
                <PositionBadge pos={g.pos} /> {g.title}
              </p>
              <ul>
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
