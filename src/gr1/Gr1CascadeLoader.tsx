import { motion, useMotionValue, useTransform, animate, type MotionValue } from 'framer-motion';
import { useEffect } from 'react';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// Centroids — used as per-arc transform origin so each pulse swells in place.
const SEGMENT_CENTROIDS: ReadonlyArray<{ cx: number; cy: number }> = [
  { cx: 12, cy: 6 },
  { cx: 13, cy: 18 },
  { cx: 17, cy: 16 },
  { cx: 7, cy: 9 },
  { cx: 7, cy: 16 },
  { cx: 17, cy: 8 },
];

// Visual order around the orbit so the ripple sweeps cleanly.
const RIPPLE_ORDER: number[] = [0, 5, 2, 1, 4, 3];

// ─── cascade ────────────────────────────────────────────────────────────────
// A radial ripple sweeps around the mark: each arc pulses (scale + opacity) in
// sequence, staggered around the orbit. Reads as deep, layered reasoning —
// multiple thoughts firing in coordinated waves. All arcs are driven by a
// single shared MotionValue with useTransform so the loop is mathematically
// seamless — there is no first/last keyframe to mismatch.
let GRADIENT_SEED = 0;

const CYCLE_DUR = 2.8;    // seconds for one full ripple lap
const PULSE_WIDTH = 0.32; // fraction of the cycle where any single arc is pulsing
const SCALE_BASE = 1;
const SCALE_PEAK = 1.16;
const OPACITY_BASE = 0.5;
const OPACITY_PEAK = 1;

export function Gr1CascadeLoader({ size = 96, color = '#04B488' }: Props) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: CYCLE_DUR,
      repeat: Infinity,
      ease: 'linear',
    });
    return () => controls.stop();
  }, [progress]);

  const uid = `gr1-cascade-${++GRADIENT_SEED}`;
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
          const slot = RIPPLE_ORDER.indexOf(pathIdx);
          const offset = slot / GR1_PATHS.length;
          return (
            <CascadePath
              key={pathIdx}
              d={d}
              color={color}
              cx={c.cx}
              cy={c.cy}
              offset={offset}
              progress={progress}
            />
          );
        })}
      </g>
    </svg>
  );
}

interface CascadePathProps {
  d: string;
  color: string;
  cx: number;
  cy: number;
  offset: number;
  progress: MotionValue<number>;
}

function CascadePath({ d, color, cx, cy, offset, progress }: CascadePathProps) {
  // Both scale and opacity follow the same Gaussian-shaped pulse, peaking
  // when progress crosses this arc's slot, falling off symmetrically. Because
  // the curve is a continuous function of (progress - offset) mod 1, the
  // value at progress=0 exactly equals the value at progress=1 — the loop is
  // seamless by construction.
  const pulse = useTransform(progress, (t) => {
    let delta = Math.abs(((t - offset) % 1 + 1) % 1);
    if (delta > 0.5) delta = 1 - delta;
    const norm = delta / PULSE_WIDTH;
    return Math.exp(-norm * norm * 2);
  });
  const scale = useTransform(pulse, (p) => SCALE_BASE + (SCALE_PEAK - SCALE_BASE) * p);
  const opacity = useTransform(pulse, (p) => OPACITY_BASE + (OPACITY_PEAK - OPACITY_BASE) * p);

  return (
    <motion.path
      d={d}
      fill={color}
      style={{
        scale,
        opacity,
        transformBox: 'fill-box',
        transformOrigin: `${cx}px ${cy}px`,
      }}
    />
  );
}
