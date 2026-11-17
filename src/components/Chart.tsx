import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { lanes, type Entry, type Lane } from "../data/site";
import Sym from "./Sym";

/* The charted log: a flow process chart of dated decisions.
   Each row sits in one of five lanes; one pen line joins them in date order. */

type Props = {
  entries: Entry[];
  filter: Lane[];
  onFilter: (next: Lane[]) => void;
  showProduct?: boolean;
};

export function sortLog(entries: Entry[]) {
  return entries
    .map((e, i) => ({ e, i }))
    .sort((a, b) =>
      a.e.date < b.e.date ? -1 : a.e.date > b.e.date ? 1 : a.i - b.i,
    )
    .map((x) => x.e);
}

export default function Chart({
  entries,
  filter,
  onFilter,
  showProduct = true,
}: Props) {
  const rows = sortLog(entries);
  const ids = new Set(rows.map((r) => r.id));
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [drawn, setDrawn] = useState(false);
  const [path, setPath] = useState("");
  const [box, setBox] = useState({ w: 0, h: 0 });
  const listRef = useRef<HTMLOListElement>(null);

  const counts = Object.fromEntries(
    lanes.map((l) => [l.id, rows.filter((r) => r.lane === l.id).length]),
  ) as Record<Lane, number>;

  const toggleLane = (lane: Lane) =>
    onFilter(
      filter.includes(lane)
        ? filter.filter((l) => l !== lane)
        : [...filter, lane],
    );

  const toggleRow = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const jumpTo = (id: string) => {
    setOpen((prev) => new Set(prev).add(id));
    if (filter.length) onFilter([]);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ block: "center" });
      el?.querySelector<HTMLButtonElement>(".row__headline")?.focus({
        preventScroll: true,
      });
    });
  };

  // Route the pen line through the filled symbol of every row.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const base = list.getBoundingClientRect();
      const pts = Array.from(
        list.querySelectorAll<HTMLElement>('[data-on="true"]'),
      ).map((el) => {
        const r = el.getBoundingClientRect();
        return `${(r.left + r.width / 2 - base.left).toFixed(1)} ${(r.top + r.height / 2 - base.top).toFixed(1)}`;
      });
      setPath(pts.length ? "M" + pts.join(" L") : "");
      setBox({ w: base.width, h: base.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [open, filter, entries]);

  // Draw the line once, the first time the chart is seen.
  useEffect(() => {
    const list = listRef.current;
    if (!list || drawn) return;
    const io = new IntersectionObserver(
      (hits) => {
        if (hits.some((h) => h.isIntersecting)) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(list);
    return () => io.disconnect();
  }, [drawn]);

  return (
    <div className="chart">
      <div
        className="chart__key"
        role="group"
        aria-label="Show only these kinds of entry"
      >
        {lanes
          .filter((l) => counts[l.id] > 0)
          .map((l) => (
            <button
              key={l.id}
              type="button"
              className="key"
              aria-pressed={filter.includes(l.id)}
              title={l.means}
              onClick={() => toggleLane(l.id)}
            >
              <Sym lane={l.id} on />
              <span className="key__label">{l.label}</span>
              <span className="key__count">{counts[l.id]}</span>
            </button>
          ))}
        {filter.length > 0 && (
          <button
            type="button"
            className="key key--clear"
            onClick={() => onFilter([])}
          >
            Show all
          </button>
        )}
      </div>

      <ol className="chart__rows" ref={listRef}>
        <svg
          className="chart__line"
          width={box.w}
          height={box.h}
          aria-hidden="true"
        >
          <path d={path} pathLength={1} className={drawn ? "is-drawn" : ""} />
        </svg>
        {rows.map((r) => {
          const tick = filter.length > 0 && !filter.includes(r.lane);
          const isOpen = open.has(r.id);
          const struck = Boolean(r.reversedBy);
          const partner = r.reversedBy ?? r.supersedes;
          const partnerRow =
            partner && ids.has(partner)
              ? rows.find((x) => x.id === partner)
              : undefined;
          return (
            <li
              key={r.id}
              id={r.id}
              className={[
                "row",
                tick && "row--tick",
                isOpen && "row--open",
                struck && "row--struck",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="row__date">
                <time dateTime={r.date}>{r.date}</time>
                {partnerRow && !tick && (
                  <button
                    type="button"
                    className="row__pair"
                    onClick={() => jumpTo(partnerRow.id)}
                  >
                    {r.reversedBy ? "reversed" : "supersedes"}{" "}
                    {partnerRow.date.slice(5)}
                  </button>
                )}
              </div>
              <div className="row__lanes" aria-hidden="true">
                {lanes.map((l) => (
                  <span
                    key={l.id}
                    className="row__cell"
                    data-on={l.id === r.lane}
                  >
                    <Sym lane={l.id} on={l.id === r.lane} />
                  </span>
                ))}
              </div>
              <div className="row__entry">
                <button
                  type="button"
                  className="row__headline"
                  aria-expanded={isOpen}
                  aria-controls={`${r.id}-detail`}
                  onClick={() => toggleRow(r.id)}
                  tabIndex={tick ? -1 : 0}
                >
                  <span className="sr-only">
                    {lanes.find((l) => l.id === r.lane)?.label}:{" "}
                  </span>
                  <span className="row__text">{r.headline}</span>
                </button>
                {showProduct && (
                  <span className="row__product">{r.product}</span>
                )}
                {r.prediction && (
                  <dl className="row__call">
                    <div>
                      <dt>called {r.prediction.calledOn}</dt>
                      <dd>{r.prediction.called}</dd>
                    </div>
                    <div>
                      <dt>
                        {r.prediction.resultOn
                          ? `result ${r.prediction.resultOn}`
                          : `review ${r.prediction.reviewOn}`}
                      </dt>
                      <dd>{r.prediction.result ?? "not in yet"}</dd>
                    </div>
                    <div className="row__grade">
                      <dt>grade</dt>
                      <dd>{r.prediction.grade}</dd>
                    </div>
                  </dl>
                )}
                <div
                  className="row__detail"
                  id={`${r.id}-detail`}
                  hidden={!isOpen}
                >
                  <p>{r.detail}</p>
                  <p className="row__source">Source: {r.source}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
