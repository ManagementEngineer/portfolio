import { experience, education } from '../data/profile'

// Career as a game log: season, team, result. Utilitarian on purpose.
export default function GameLog() {
  return (
    <section className="section" id="gamelog">
      <div className="wrap">
        <p className="section-kicker">Career game log</p>
        <h2 className="section-title">Previous seasons</h2>
        <p className="section-sub">
          Before building fantasy products full-tilt: operations and analytics roles where the job was finding the
          number that changes the decision.
        </p>

        <div className="gamelog">
          {experience.map((e) => (
            <article key={e.company + e.start} className="gamelog__entry">
              <div className="gamelog__season num">
                {e.start} – {e.end}
              </div>
              <div>
                <h3 className="gamelog__role">
                  {e.role} <span className="gamelog__team">· {e.company}</span>
                </h3>
                <ul className="gamelog__bullets">
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="gamelog__edu">
          {education.map((ed) => (
            <p key={ed.school}>
              <strong>{ed.school}</strong> — {ed.credential} <span className="num">({ed.period})</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
