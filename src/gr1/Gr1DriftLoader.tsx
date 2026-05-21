import { motion, useMotionValue, useTransform, animate, type MotionValue } from 'framer-motion';
import { useEffect } from 'react';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// ─── drift ──────────────────────────────────────────────────────────────────
// Slow continuous rotation of the whole mark, with a soft opacity wave that
// travels around the orbit so each arc takes its turn glowing. Reads as a
// calm, always-on "GR-1 is here" presence — low intensity, hypnotic. The
// wave is driven by a single MotionValue so all six arcs stay perfectly in
// phase with each other.
let GRADIENT_SEED = 0;

const WAVE_DUR = 3;       // seconds for one full trip of the highlight around the orbit
const SPIN_DUR = 6;       // seconds for one full mark rotation
const DIM = 0.35;         // baseline brightness
const PEAK = 1;           // brightness at the highlight crest

export function Gr1DriftLoader({ size = 96, color = '#04B488' }: Props) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: WAVE_DUR,
      repeat: Infinity,
      ease: 'linear',
    });
    return () => controls.stop();
  }, [progress]);

  const uid = `gr1-drift-${++GRADIENT_SEED}`;
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
          {GR1_PATHS.map((d, i) => (
            <DriftPath key={i} d={d} color={color} index={i} progress={progress} />
          ))}
        </motion.g>
      </g>
    </svg>
  );
}

interface DriftPathProps {
  d: string;
  color: string;
  index: number;
  progress: MotionValue<number>;
}

function DriftPath({ d, color, index, progress }: DriftPathProps) {
  // Each arc's brightness peaks when `progress` crosses index/6. The opacity
  // curve is a triangle wraparound built from 13 control points so the loop
  // closes seamlessly at the boundary.
  const offset = index / GR1_PATHS.length;
  const opacity = useTransform(progress, (t) => {
    // distance around the unit circle from this arc's phase
    let delta = Math.abs(((t - offset) % 1 + 1) % 1);
    if (delta > 0.5) delta = 1 - delta;
    // delta is now 0 at peak, 0.5 at trough. Smoothstep for soft falloff.
    const x = 1 - delta * 2;
    const eased = x * x * (3 - 2 * x);
    return DIM + (PEAK - DIM) * eased;
  });
  return <motion.path d={d} fill={color} style={{ opacity }} />;
}
