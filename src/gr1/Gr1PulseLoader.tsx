import { motion } from 'framer-motion';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// ─── pulse ──────────────────────────────────────────────────────────────────
// Whole-mark animation (no per-segment stagger): the entire GR-1 logo breathes
// — scale + opacity pulse together — while continuously rotating. Reads as
// the assistant being attentive / listening as one cohesive presence rather
// than a sequence of nodes.
let GRADIENT_SEED = 0;

export function Gr1PulseLoader({ size = 96, color = '#04B488' }: Props) {
  const breatheDur = 2.2;
  const spinDur = 8;
  const uid = `gr1-pulse-${++GRADIENT_SEED}`;
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
          transition={{ duration: spinDur, repeat: Infinity, ease: 'linear' }}
        >
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.55, 1, 0.55] }}
            transition={{
              duration: breatheDur,
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
