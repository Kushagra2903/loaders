import { motion } from 'framer-motion';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// ─── convolve ───────────────────────────────────────────────────────────────
// Two interleaved sets of arcs (even indices, odd indices) rotate in opposite
// directions at slightly different speeds, with a slow global breathe on top.
// Reads as two thought streams folding into each other — parallel processing,
// sustained. Loops perfectly: each rotate is 360° (returns to start), and the
// breathe's first/last keyframes are identical.
let GRADIENT_SEED = 0;

const SPIN_CW = 5;        // seconds for the clockwise group
const SPIN_CCW = 7;       // seconds for the counter-clockwise group
const BREATHE_DUR = 3;

export function Gr1ConvolveLoader({ size = 96, color = '#04B488' }: Props) {
  const uid = `gr1-convolve-${++GRADIENT_SEED}`;
  const gradId = `${uid}-grad`;
  const maskId = `${uid}-mask`;
  const radius = GR1_RAW_SIZE * 0.524;

  const evens = GR1_PATHS.filter((_, i) => i % 2 === 0);
  const odds = GR1_PATHS.filter((_, i) => i % 2 === 1);

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
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: BREATHE_DUR, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
        >
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={{ rotate: 360 }}
            transition={{ duration: SPIN_CW, repeat: Infinity, ease: 'linear' }}
          >
            {evens.map((d, i) => (
              <path key={`e-${i}`} d={d} fill={color} />
            ))}
          </motion.g>
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={{ rotate: -360 }}
            transition={{ duration: SPIN_CCW, repeat: Infinity, ease: 'linear' }}
          >
            {odds.map((d, i) => (
              <path key={`o-${i}`} d={d} fill={color} />
            ))}
          </motion.g>
        </motion.g>
      </g>
    </svg>
  );
}
