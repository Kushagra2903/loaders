import { motion, useMotionValue, useTransform, animate, type MotionValue } from 'framer-motion';
import { useEffect } from 'react';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// Visual sweep order (top → upper-left → lower-left → bottom → lower-right →
// upper-right). Same as Sequence loader's REVEAL_ORDER — ensures the trace
// reads as one continuous orbit, not a scrambled flicker through path indices.
const ORBIT_ORDER: number[] = [0, 5, 2, 1, 4, 3];

// ─── trace ──────────────────────────────────────────────────────────────────
// A single bright arc moves around the orbit; the other arcs sit at a dim
// baseline. Reads as attention sweeping around the mark — one focused thought
// at a time, traveling through GR-1. Loops perfectly because the highlight
// position wraps continuously and every arc returns to its baseline.
let GRADIENT_SEED = 0;

const SWEEP_DUR = 2.4;    // seconds for one full orbit of the highlight
const DIM = 0.22;         // baseline brightness for non-active arcs
const PEAK = 1;
const FOCUS_WIDTH = 0.18; // how wide the highlight is, as a fraction of the orbit (smaller = sharper focus)

export function Gr1TraceLoader({ size = 96, color = '#04B488' }: Props) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: SWEEP_DUR,
      repeat: Infinity,
      ease: 'linear',
    });
    return () => controls.stop();
  }, [progress]);

  const uid = `gr1-trace-${++GRADIENT_SEED}`;
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
          const slot = ORBIT_ORDER.indexOf(pathIdx);
          const offset = slot / GR1_PATHS.length;
          return <TracePath key={pathIdx} d={d} color={color} offset={offset} progress={progress} />;
        })}
      </g>
    </svg>
  );
}

interface TracePathProps {
  d: string;
  color: string;
  offset: number;
  progress: MotionValue<number>;
}

function TracePath({ d, color, offset, progress }: TracePathProps) {
  const opacity = useTransform(progress, (t) => {
    // distance around the unit circle from this arc's slot
    let delta = Math.abs(((t - offset) % 1 + 1) % 1);
    if (delta > 0.5) delta = 1 - delta;
    // Sharp Gaussian-like falloff so only one arc is bright at a time.
    const norm = delta / FOCUS_WIDTH;
    const eased = Math.exp(-norm * norm * 2);
    return DIM + (PEAK - DIM) * eased;
  });
  return <motion.path d={d} fill={color} style={{ opacity }} />;
}
