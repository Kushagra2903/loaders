import { motion } from 'framer-motion';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// ─── thinking ───────────────────────────────────────────────────────────────
// Each of the 6 arc segments pulses (opacity + scale) in sequence around the
// orbit, and the whole mark rotates slowly — the classic AI-assistant
// "processing / thinking" feel. The radial-luminance mask from the source SVG
// is preserved so the mark keeps its soft center-out falloff.
let GRADIENT_SEED = 0;

export function Gr1ThinkingLoader({ size = 96, color = '#04B488' }: Props) {
  const segmentDur = 1.6;
  const stagger = segmentDur / GR1_PATHS.length;
  const spinDur = 6;
  // Unique IDs so multiple instances on the same page don't collide.
  const uid = `gr1-think-${++GRADIENT_SEED}`;
  const gradId = `${uid}-grad`;
  const maskId = `${uid}-mask`;
  const radius = GR1_RAW_SIZE * 0.524; // matches source: scale(12.5751) on a 24-unit box

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
          {GR1_PATHS.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill={color}
              style={{
                transformBox: 'fill-box',
                transformOrigin: `${GR1_CENTER}px ${GR1_CENTER}px`,
              }}
              initial={{ opacity: 0.25, scale: 0.94 }}
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.94, 1.06, 0.94] }}
              transition={{
                duration: segmentDur,
                ease: [0.45, 0, 0.55, 1],
                repeat: Infinity,
                delay: i * stagger,
              }}
            />
          ))}
        </motion.g>
      </g>
    </svg>
  );
}
