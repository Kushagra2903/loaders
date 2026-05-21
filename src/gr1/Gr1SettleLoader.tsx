import { motion } from 'framer-motion';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// Same radial geometry as Assemble — each arc enters from outside the viewBox
// along its own radial vector.
const SEGMENT_ANGLES_DEG = [-20, 160, 100, -80, -140, 40] as const;
const ENTRY_DISTANCE = 3.5; // shorter than Assemble's 18 — a tight overshoot, not a long fly-in

// ─── settle ─────────────────────────────────────────────────────────────────
// All arcs converge from just past their home positions with a slight
// overshoot, then settle. The full mark holds, fades out together, and the
// cycle restarts. Reads as the assistant "locking in" an answer — a confident
// resolution rather than a loud arrival. Loops perfectly: first and last
// keyframes are the same baseline.
let GRADIENT_SEED = 0;

const APPROACH_DUR = 0.55;
const OVERSHOOT_FRACTION = 0.7; // where in the approach the overshoot peak lands
const HOLD = 0.9;
const FADE = 0.4;
const TAIL = 0.25;
const TOTAL = APPROACH_DUR + HOLD + FADE + TAIL;

// Spring-feel cubic-bezier — a small overshoot then settle. This curve is
// applied per-property; the overshoot is realized via the keyframe values, not
// the easing alone (cubic-bezier with y > 1 isn't supported by framer-motion).
const APPROACH_EASE: [number, number, number, number] = [0.34, 1.1, 0.64, 1];

export function Gr1SettleLoader({ size = 96, color = '#04B488' }: Props) {
  const uid = `gr1-settle-${++GRADIENT_SEED}`;
  const gradId = `${uid}-grad`;
  const maskId = `${uid}-mask`;
  const radius = GR1_RAW_SIZE * 0.524;

  // Phase times normalised into [0..1] of the full cycle
  const tApproachEnd = APPROACH_DUR / TOTAL;
  const tOvershoot = (APPROACH_DUR * OVERSHOOT_FRACTION) / TOTAL;
  const tHoldEnd = (APPROACH_DUR + HOLD) / TOTAL;
  const tFadeEnd = (APPROACH_DUR + HOLD + FADE) / TOTAL;

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
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={-GR1_RAW_SIZE}
          y={-GR1_RAW_SIZE}
          width={GR1_RAW_SIZE * 3}
          height={GR1_RAW_SIZE * 3}
        >
          <rect x={0} y={0} width={GR1_RAW_SIZE} height={GR1_RAW_SIZE} fill={`url(#${gradId})`} />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        {GR1_PATHS.map((d, i) => {
          const angleRad = (SEGMENT_ANGLES_DEG[i] * Math.PI) / 180;
          const dx = Math.cos(angleRad) * ENTRY_DISTANCE;
          const dy = Math.sin(angleRad) * ENTRY_DISTANCE;
          // Overshoot direction is inward past home — a tiny bias toward center
          const ox = -dx * 0.12;
          const oy = -dy * 0.12;
          const times = [0, tOvershoot, tApproachEnd, tHoldEnd, tFadeEnd, 1];
          return (
            <motion.path
              key={i}
              d={d}
              fill={color}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              animate={{
                x: [dx, ox, 0, 0, dx * 0.3, dx],
                y: [dy, oy, 0, 0, dy * 0.3, dy],
                opacity: [0, 1, 1, 1, 0, 0],
                scale: [0.85, 1.02, 1, 1, 0.92, 0.85],
              }}
              transition={{
                duration: TOTAL,
                times,
                repeat: Infinity,
                ease: APPROACH_EASE,
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}
