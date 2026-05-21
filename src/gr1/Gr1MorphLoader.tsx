import { motion } from 'framer-motion';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// Approximate centroid for each arc segment (in raw 24-unit SVG coords).
// Used as the origin point for the dot → shape morph: each node first appears
// as a dot at its centroid, then expands outward into its arc geometry.
const SEGMENT_CENTROIDS: ReadonlyArray<{ cx: number; cy: number }> = [
  { cx: 12, cy: 6 },    // top-right curve
  { cx: 13, cy: 18 },   // bottom-right curve
  { cx: 17, cy: 16 },   // right horizontal curve
  { cx: 7, cy: 9 },     // top-left horizontal curve
  { cx: 7, cy: 16 },    // bottom-left curve
  { cx: 17, cy: 8 },    // top vertical curve
];

const DOT_RADIUS = 0.9;

// ─── morph ──────────────────────────────────────────────────────────────────
// Each node is born as a small dot at its centroid, then morphs outward into
// its full arc shape (crossfade + scale-up from the centroid). After holding
// the full mark briefly, every arc collapses back into its dot and fades out.
// All nodes morph simultaneously so the dot→shape transformation is the focus.
let GRADIENT_SEED = 0;

export function Gr1MorphLoader({ size = 96, color = '#04B488' }: Props) {
  const dotIn = 0.4;
  const morph = 0.6;
  const hold = 0.7;
  const collapse = 0.55;
  const dotOut = 0.35;
  const total = dotIn + morph + hold + collapse + dotOut;
  const t = [
    0,
    dotIn / total,
    (dotIn + morph) / total,
    (dotIn + morph + hold) / total,
    (dotIn + morph + hold + collapse) / total,
    1,
  ];
  const SMOOTH: [number, number, number, number] = [0.4, 0, 0.2, 1];

  const uid = `gr1-morph-${++GRADIENT_SEED}`;
  const gradId = `${uid}-grad`;
  const maskId = `${uid}-mask`;
  const radius = GR1_RAW_SIZE * 0.524;

  return (
    <svg width={size} height={size} viewBox={GR1_VIEWBOX} fill="none">
      <defs>
        <radialGradient
          id={gradId}
          cx={GR1_CENTER}
          cy={GR1_CENTER}
          r={radius}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={GR1_RAW_SIZE} height={GR1_RAW_SIZE}>
          <rect x={0} y={0} width={GR1_RAW_SIZE} height={GR1_RAW_SIZE} fill={`url(#${gradId})`} />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        {GR1_PATHS.map((d, i) => {
          const c = SEGMENT_CENTROIDS[i];
          return (
            <g key={i}>
              {/* The dot — visible only on the way in and on the way out */}
              <motion.circle
                cx={c.cx}
                cy={c.cy}
                r={DOT_RADIUS}
                fill={color}
                animate={{ opacity: [0, 1, 0, 0, 1, 0], scale: [0.4, 1, 1, 1, 1, 0.4] }}
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: `${c.cx}px ${c.cy}px`,
                }}
                transition={{ duration: total, times: t, repeat: Infinity, ease: SMOOTH }}
              />
              {/* The arc — appears as the dot fades, anchored at the same centroid */}
              <motion.path
                d={d}
                fill={color}
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: `${c.cx}px ${c.cy}px`,
                }}
                animate={{ opacity: [0, 0, 1, 1, 0, 0], scale: [0, 0.2, 1, 1, 0.2, 0] }}
                transition={{ duration: total, times: t, repeat: Infinity, ease: SMOOTH }}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
