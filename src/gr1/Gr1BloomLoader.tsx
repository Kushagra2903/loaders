import { motion } from 'framer-motion';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// Centroids in raw 24-unit SVG coords — each arc blooms from its own centroid
// so the swell happens in place rather than from the page origin.
const SEGMENT_CENTROIDS: ReadonlyArray<{ cx: number; cy: number }> = [
  { cx: 12, cy: 6 },
  { cx: 13, cy: 18 },
  { cx: 17, cy: 16 },
  { cx: 7, cy: 9 },
  { cx: 7, cy: 16 },
  { cx: 17, cy: 8 },
];

// Bloom order — outward radial sweep, starts from the top and spirals around.
const BLOOM_ORDER: number[] = [0, 5, 2, 1, 4, 3];

// ─── bloom ──────────────────────────────────────────────────────────────────
// All arcs swell outward from their own centroid with a small per-arc stagger,
// reach a slight overshoot, settle to full size, hold, then synchronised soft
// contract back to baseline before the next bloom. Reads as the answer landing
// — confident, decisive, then releasing. Loops perfectly: first and last
// keyframe of every arc's animation are identical baseline values.
let GRADIENT_SEED = 0;

const BLOOM_IN = 0.55;     // seconds for the bloom-out phase per arc
const STAGGER = 0.06;      // seconds between successive arcs starting their bloom
const HOLD = 0.7;          // seconds the full mark stays at peak
const CONTRACT = 0.4;      // seconds for the synchronised contract back to baseline
const TAIL = 0.25;         // baseline-quiet time before the next cycle begins
const SCALE_BASE = 0.6;
const SCALE_OVERSHOOT = 1.08;
const SCALE_REST = 1;

export function Gr1BloomLoader({ size = 96, color = '#04B488' }: Props) {
  const totalBlooms = STAGGER * (GR1_PATHS.length - 1) + BLOOM_IN;
  const total = totalBlooms + HOLD + CONTRACT + TAIL;

  const uid = `gr1-bloom-${++GRADIENT_SEED}`;
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
        {GR1_PATHS.map((d, pathIdx) => {
          const c = SEGMENT_CENTROIDS[pathIdx];
          const slot = BLOOM_ORDER.indexOf(pathIdx);
          // Per-arc bloom window
          const bloomStart = slot * STAGGER;
          const overshootAt = bloomStart + BLOOM_IN * 0.7;
          const settleAt = bloomStart + BLOOM_IN;
          // Shared contract window — all arcs contract together at the end
          const contractStart = totalBlooms + HOLD;
          const contractEnd = contractStart + CONTRACT;
          const times = [
            0,
            bloomStart / total,
            overshootAt / total,
            settleAt / total,
            contractStart / total,
            contractEnd / total,
            1,
          ];
          return (
            <motion.path
              key={pathIdx}
              d={d}
              fill={color}
              style={{
                transformBox: 'fill-box',
                transformOrigin: `${c.cx}px ${c.cy}px`,
              }}
              animate={{
                scale: [SCALE_BASE, SCALE_BASE, SCALE_OVERSHOOT, SCALE_REST, SCALE_REST, SCALE_BASE, SCALE_BASE],
                opacity: [0.4, 0.4, 1, 1, 1, 0.4, 0.4],
              }}
              transition={{
                duration: total,
                times,
                repeat: Infinity,
                ease: [0.32, 0.72, 0, 1],
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}
