const INK = "var(--ink)";

const wheels = [14, 28, 66, 96, 110];

/**
 * Side view of a car transporter: cab with a gold windscreen pulling a
 * two-deck trailer with four cars. Cars, cab and wheels have a light gold
 * outline (pick a shade that shows against the background). Wheels carry
 * the `truck-wheel` class so CSS can spin them.
 */
export function TransporterTruck({
  className,
  outline = "var(--gold)",
}: {
  className?: string;
  outline?: string;
}) {
  const OUTLINE = outline;
  return (
    <svg
      viewBox="-2 -2 124 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Trailer: deck, top rail and posts */}
      <rect x="0" y="22" width="84" height="6" rx="1" fill={INK} />
      <rect x="4" y="8" width="76" height="3" rx="1" fill={INK} />
      <rect x="6" y="11" width="3" height="11" fill={INK} />
      <rect x="40" y="11" width="3" height="11" fill={INK} />
      <rect x="74" y="11" width="3" height="11" fill={INK} />
      <rect x="84" y="24" width="6" height="3" fill={INK} />

      {/* Four cars and the cab, outlined in light gold */}
      <g fill={INK} stroke={OUTLINE} strokeWidth="1.4" strokeLinejoin="round">
        <path d="M12 8 q2-6 8-6 h12 q5 0 7 6 z" />
        <path d="M48 8 q2-6 8-6 h12 q5 0 7 6 z" />
        <path d="M12 22 q2-6 8-6 h12 q5 0 7 6 z" />
        <path d="M48 22 q2-6 8-6 h12 q5 0 7 6 z" />
        <path d="M88 28 V12 q0-4 4-4 h14 q4 0 6 4 l6 10 v6 z" />
      </g>
      {/* Window pillars on the cars */}
      <g stroke={OUTLINE} strokeWidth="1">
        <line x1="20" y1="4" x2="20" y2="7" />
        <line x1="56" y1="4" x2="56" y2="7" />
        <line x1="20" y1="18" x2="20" y2="21" />
        <line x1="56" y1="18" x2="56" y2="21" />
      </g>
      {/* Windscreen and headlight */}
      <path
        d="M100 11 h6 q2 0 3 2 l4 7 h-13 z"
        fill="var(--gold)"
        stroke={OUTLINE}
        strokeWidth="1"
      />
      <rect x="114" y="23" width="4" height="2" rx="1" fill={OUTLINE} />

      {/* Wheels, each with a spoke so the spin is visible */}
      {wheels.map((cx) => (
        <g key={cx} className="truck-wheel">
          <circle
            cx={cx}
            cy="34"
            r="6"
            fill={INK}
            stroke={OUTLINE}
            strokeWidth="1.5"
          />
          <line
            x1={cx}
            y1="29"
            x2={cx}
            y2="39"
            stroke={OUTLINE}
            strokeWidth="1.2"
          />
        </g>
      ))}
    </svg>
  );
}
