import { motion, useMotionValue, useTransform, animate, type MotionValue } from 'framer-motion';
import { useEffect } from 'react';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// Visual order around the orbit — the wave traverses in this sequence.
const ORBIT_ORDER: number[] = [0, 5, 2, 1, 4, 3];

// ─── resonate ───────────────────────────────────────────────────────────────
// The whole mark rotates clockwise. Simultaneously, a brightness wave travels
// around the arcs in the opposite direction (counter-rotates inside the spin).
// Reads as two rhythms crossing — like a thought rotating while attention
// scans the other way across it. The counter-motion is more interesting than
// a wave moving with the rotation, which would look static.
let GRADIENT_SEED = 0;

const SPIN_DUR = 5;      // seconds for one full clockwise rotation
const WAVE_DUR = 2.4;    // seconds for one full counter-clockwise wave lap
const DIM = 0.32;
const PEAK = 1;
const WAVE_WIDTH = 0.22; // sharpness of the brightness peak

export function Gr1ResonateLoader({ size = 96, color = '#04B488' }: Props) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: WAVE_DUR,
      repeat: Infinity,
      ease: 'linear',
    });
    return () => controls.stop();
  }, [progress]);

  const uid = `gr1-resonate-${++GRADIENT_SEED}`;
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
          {GR1_PATHS.map((d, pathIdx) => {
            const slot = ORBIT_ORDER.indexOf(pathIdx);
            // Negate the offset so the wave traverses counter to the spin.
            const offset = -slot / GR1_PATHS.length;
            return (
              <ResonatePath
                key={pathIdx}
                d={d}
                color={color}
                offset={offset}
                progress={progress}
              />
            );
          })}
        </motion.g>
      </g>
    </svg>
  );
}

interface ResonatePathProps {
  d: string;
  color: string;
  offset: number;
  progress: MotionValue<number>;
}

function ResonatePath({ d, color, offset, progress }: ResonatePathProps) {
  const opacity = useTransform(progress, (t) => {
    let delta = Math.abs(((t - offset) % 1 + 1) % 1);
    if (delta > 0.5) delta = 1 - delta;
    const norm = delta / WAVE_WIDTH;
    const eased = Math.exp(-norm * norm * 2);
    return DIM + (PEAK - DIM) * eased;
  });
  return <motion.path d={d} fill={color} style={{ opacity }} />;
}
