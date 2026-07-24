interface NodeProps {
  x: number;
  y: number;
  r: number;
  variant?: 'solid' | 'ghost';
}

function PersonNode({ x, y, r, variant = 'solid' }: NodeProps) {
  const scale = r / 24;
  const isSolid = variant === 'solid';
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={isSolid ? '#ffffff' : 'rgba(255,255,255,0.10)'}
        stroke={isSolid ? 'none' : 'rgba(255,255,255,0.5)'}
        strokeWidth={1.5}
      />
      <g
        transform={`translate(${x} ${y}) scale(${scale})`}
        fill={isSolid ? '#0d9488' : 'rgba(255,255,255,0.65)'}
      >
        <circle cx="0" cy="-6.5" r="6" />
        <path d="M-11 12 a11 11 0 0 1 22 0 Z" />
      </g>
    </g>
  );
}

/** An abstract "connected team" graphic for the sign-in panel. */
export function DirectoryArt() {
  return (
    <svg viewBox="0 0 480 400" fill="none" role="img" aria-label="A network of connected people">
      <circle cx="250" cy="190" r="112" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <circle cx="250" cy="190" r="170" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />

      <g stroke="rgba(255,255,255,0.22)" strokeWidth="1.5">
        <line x1="250" y1="190" x2="110" y2="96" />
        <line x1="250" y1="190" x2="400" y2="120" />
        <line x1="250" y1="190" x2="96" y2="286" />
        <line x1="250" y1="190" x2="392" y2="282" />
        <line x1="250" y1="190" x2="250" y2="348" />
      </g>

      <g fill="#5eead4">
        <circle cx="330" cy="70" r="3.5" />
        <circle cx="150" cy="200" r="3" />
        <circle cx="300" cy="330" r="3" />
        <circle cx="430" cy="200" r="2.5" />
      </g>

      <PersonNode x={110} y={96} r={26} />
      <PersonNode x={400} y={120} r={22} variant="ghost" />
      <PersonNode x={96} y={286} r={22} variant="ghost" />
      <PersonNode x={392} y={282} r={28} />
      <PersonNode x={250} y={348} r={18} variant="ghost" />
      <PersonNode x={250} y={190} r={42} />
    </svg>
  );
}
