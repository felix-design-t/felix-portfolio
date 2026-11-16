/**
 * 20 fundraising events, plotted as expected vs actual.
 *
 * The diagonal is "raised exactly what was expected." Three dots sit
 * above it. The other 17 sit in the pale region below it.
 */
const events: { expected: number; actual: number }[] = [
  { expected: 5.4, actual: 8.1 },
  { expected: 7.3, actual: 9.4 },
  { expected: 10.1, actual: 12.6 },
  { expected: 4.6, actual: 2.4 },
  { expected: 5.8, actual: 4.4 },
  { expected: 6.8, actual: 5.9 },
  { expected: 7.4, actual: 4.1 },
  { expected: 7.9, actual: 5.2 },
  { expected: 8.3, actual: 2.5 },
  { expected: 8.6, actual: 6.9 },
  { expected: 8.9, actual: 5.3 },
  { expected: 9.3, actual: 6.6 },
  { expected: 9.7, actual: 4.3 },
  { expected: 10.6, actual: 4.6 },
  { expected: 11.0, actual: 6.1 },
  { expected: 11.5, actual: 8.5 },
  { expected: 12.2, actual: 9.9 },
  { expected: 13.0, actual: 9.0 },
  { expected: 13.5, actual: 6.6 },
  { expected: 16.0, actual: 10.9 },
];

const plot = { x: 58, y: 12, width: 430, height: 268 };
const max = 18;
const ticks = [0, 3, 6, 9, 12, 15, 18];

function xOf(value: number) {
  return plot.x + (value / max) * plot.width;
}

function yOf(value: number) {
  return plot.y + plot.height - (value / max) * plot.height;
}

export function FundraisingScatter() {
  const above = events.filter((event) => event.actual > event.expected).length;

  return (
    <div className="research-insight">
      <p className="research-callout">
        <span className="research-callout-mark">17 out of 20</span> fundraising
        events are <span className="research-callout-mark">underperforming</span>
      </p>
      <svg
        className="research-scatter"
        viewBox="0 0 520 340"
        role="img"
        aria-label={`${events.length - above} of ${events.length} fundraising events raised less than expected`}
      >
        <polygon
          className="research-scatter-region"
          points={`${xOf(0)},${yOf(0)} ${xOf(max)},${yOf(0)} ${xOf(max)},${yOf(max)}`}
        />
        {ticks.map((tick) => (
          <g key={tick} className="research-scatter-grid">
            <line x1={xOf(tick)} y1={yOf(0)} x2={xOf(tick)} y2={yOf(max)} />
            <line x1={xOf(0)} y1={yOf(tick)} x2={xOf(max)} y2={yOf(tick)} />
            <text x={xOf(tick)} y={yOf(0) + 16} textAnchor="middle">
              {tick}
            </text>
            <text x={xOf(0) - 8} y={yOf(tick) + 4} textAnchor="end">
              {tick}
            </text>
          </g>
        ))}
        <line
          className="research-scatter-even"
          x1={xOf(0)}
          y1={yOf(0)}
          x2={xOf(max)}
          y2={yOf(max)}
        />
        <text className="research-scatter-zone" x={xOf(1)} y={yOf(16.6)}>
          OVERPERFORMING
        </text>
        <text className="research-scatter-zone" x={xOf(11.2)} y={yOf(2.2)}>
          UNDERPERFORMING
        </text>
        {events.map((event) => (
          <circle
            key={`${event.expected}-${event.actual}`}
            className="research-scatter-dot"
            cx={xOf(event.expected)}
            cy={yOf(event.actual)}
            r={5}
          />
        ))}
        <text
          className="research-scatter-axis"
          x={xOf(max / 2)}
          y={328}
          textAnchor="middle"
        >
          Expected Fund Raised ($K)
        </text>
        <text
          className="research-scatter-axis"
          transform={`translate(16 ${yOf(max / 2)}) rotate(-90)`}
          textAnchor="middle"
        >
          Actual Fund Raised ($K)
        </text>
      </svg>
    </div>
  );
}
