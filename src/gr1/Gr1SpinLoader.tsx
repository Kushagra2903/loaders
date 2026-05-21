import { motion } from 'framer-motion';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// ─── spin ───────────────────────────────────────────────────────────────────
// The whole GR-1 mark rotates as one solid unit at a steady cadence, with a
// gentle heartbeat swell (scale + opacity) layered on top. Same proven
// nested-motion.g pattern as Pulse, just with a faster spin and a quieter
// breathe so the rotation reads as the dominant motion.
let GRADIENT_SEED = 0;

const SPIN_DUR = 3.2;     // seconds for one full 360° rotation
const BREATHE_DUR = 3.2;  // matches spin — one heartbeat per revolution

export function Gr1SpinLoader({ size = 96, color = '#04B488' }: Props) {
  const uid = `gr1-spin-${++GRADIENT_SEED}`;
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
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={{ rotate: 360 }}
          transition={{ duration: SPIN_DUR, repeat: Infinity, ease: 'linear' }}
        >
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={{ scale: [0.96, 1.05, 0.96], opacity: [0.85, 1, 0.85] }}
            transition={{
              duration: BREATHE_DUR,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
            }}
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
