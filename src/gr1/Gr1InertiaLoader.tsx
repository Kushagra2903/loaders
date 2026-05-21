import { motion } from 'framer-motion';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// ─── inertia ────────────────────────────────────────────────────────────────
// The whole mark rotates a full 360° per cycle, but with variable speed —
// it accelerates through the middle and slows at the start/end of each
// rotation. The total rotation always completes a clean 360° per cycle so
// the loop joins seamlessly, but each lap feels organic rather than
// mechanical. A slow breathe layered on top adds a second rhythm.
//
// Why this isn't a reversal: pendulum/oscillation reads as indecision.
// Always-forward rotation with variable cadence reads as continuous thought
// that gathers momentum, then catches itself before starting fresh.
let GRADIENT_SEED = 0;

const CYCLE_DUR = 3.4;    // seconds for one full 360° rotation
const BREATHE_DUR = 2.7;

export function Gr1InertiaLoader({ size = 96, color = '#04B488' }: Props) {
  const uid = `gr1-inertia-${++GRADIENT_SEED}`;
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
        {/* Outer: 360° rotation per cycle, variable speed via keyframe spacing.
            The `times` array places the 90/180/270 milestones unevenly within
            the cycle, producing the slow-fast-slow cadence. Cubic-bezier
            easing between keyframes smooths the transitions. */}
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={{ rotate: [0, 90, 270, 360] }}
          transition={{
            duration: CYCLE_DUR,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.38, 0.62, 1],
          }}
        >
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={{ scale: [0.95, 1.03, 0.95], opacity: [0.78, 1, 0.78] }}
            transition={{ duration: BREATHE_DUR, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          >
            {GR1_PATHS.map((d, i) => (
              <path key={i} d={d} fill={color} />
            ))}
          </motion.g>
        </motion.g>
      </g>
    </svg>
  );
}
