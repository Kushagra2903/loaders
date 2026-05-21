import { motion } from 'framer-motion';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// Centroid of each arc segment (used as the origin of the dot and the
// circular reveal that expands outward to uncover the arc).
const SEGMENT_CENTROIDS: ReadonlyArray<{ cx: number; cy: number }> = [
  { cx: 12, cy: 6 },
  { cx: 13, cy: 18 },
  { cx: 17, cy: 16 },
  { cx: 7, cy: 9 },
  { cx: 7, cy: 16 },
  { cx: 17, cy: 8 },
];

const DOT_R = 0.9;
// Big enough that, centred on any segment's centroid, it fully contains the
// arc's geometry — so the reveal terminates with the whole shape visible.
const REVEAL_MAX_R = 18;

// ─── grow ───────────────────────────────────────────────────────────────────
// True dot → shape expansion. Each node renders the arc path clipped by a
// circular reveal mask that grows outward from the centroid. While the mask
// is small, only a dot-sized blob of the arc is visible — which the eye reads
// as "a dot." As the mask radius grows, the dot visibly bulges and stretches
// into the full arc shape. A matching dot underneath ensures something is
// painted even when the reveal radius is smaller than the arc's near edge.
let GRADIENT_SEED = 0;

export function Gr1GrowLoader({ size = 96, color = '#04B488' }: Props) {
  const dotIn = 0.35;
  const expand = 0.7;
  const hold = 0.7;
  const contract = 0.6;
  const dotOut = 0.3;
  const total = dotIn + expand + hold + contract + dotOut;
  const t = [
    0,
    dotIn / total,
    (dotIn + expand) / total,
    (dotIn + expand + hold) / total,
    (dotIn + expand + hold + contract) / total,
    1,
  ];
  const SMOOTH: [number, number, number, number] = [0.4, 0, 0.2, 1];

  const uid = `gr1-grow-${++GRADIENT_SEED}`;
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
        {SEGMENT_CENTROIDS.map((c, i) => (
          <clipPath key={i} id={`${uid}-clip-${i}`}>
            <motion.circle
              cx={c.cx}
              cy={c.cy}
              animate={{ r: [0, DOT_R, REVEAL_MAX_R, REVEAL_MAX_R, DOT_R, 0] }}
              transition={{ duration: total, times: t, repeat: Infinity, ease: SMOOTH }}
            />
          </clipPath>
        ))}
      </defs>
      <g mask={`url(#${maskId})`}>
        {GR1_PATHS.map((d, i) => {
          const c = SEGMENT_CENTROIDS[i];
          return (
            <g key={i}>
              {/* Seed dot — guarantees a visible blob at the centroid during
                  the dot phase, in case the arc geometry doesn't overlap the
                  centroid itself. Fades as the reveal expands beyond it. */}
              <motion.circle
                cx={c.cx}
                cy={c.cy}
                fill={color}
                animate={{ r: [0, DOT_R, DOT_R * 1.3, DOT_R * 1.3, DOT_R, 0], opacity: [0, 1, 0, 0, 1, 0] }}
                transition={{ duration: total, times: t, repeat: Infinity, ease: SMOOTH }}
              />
              {/* The arc, revealed by the expanding circular clip. As the clip
                  grows from a dot to encompassing the whole arc, the visible
                  shape morphs from a point into the full segment. */}
              <path d={d} fill={color} clipPath={`url(#${uid}-clip-${i})`} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
