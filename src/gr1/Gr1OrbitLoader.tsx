import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// ─── orbit ──────────────────────────────────────────────────────────────────
// The whole mark rotates slowly in one direction while a small satellite dot
// orbits the inner hub in the opposite direction at its own pace. Two
// concentric rhythms — the mark's quiet rotation and the focal point of a
// single bright dot circling within. Reads as deep, sustained attention with
// an inner focal beam moving through it.
//
// The satellite uses motion values on cx/cy directly (parametric circle)
// rather than CSS-transform rotation, so we don't have to fight SVG's
// transform-origin / fill-box semantics on a single-circle group.
let GRADIENT_SEED = 0;

const MARK_SPIN_DUR = 7;     // seconds for one full mark rotation
const DOT_ORBIT_DUR = 2.6;   // seconds for one full satellite orbit
const DOT_RADIUS = 0.85;     // satellite dot radius in raw units
const ORBIT_RADIUS = 4.2;    // satellite orbit radius from center

export function Gr1OrbitLoader({ size = 96, color = '#04B488' }: Props) {
  const angle = useMotionValue(0);

  useEffect(() => {
    // Counter-rotate the satellite (negative direction) relative to the mark.
    const controls = animate(angle, -Math.PI * 2, {
      duration: DOT_ORBIT_DUR,
      repeat: Infinity,
      ease: 'linear',
    });
    return () => controls.stop();
  }, [angle]);

  const cx = useTransform(angle, (a) => GR1_CENTER + Math.cos(a) * ORBIT_RADIUS);
  const cy = useTransform(angle, (a) => GR1_CENTER + Math.sin(a) * ORBIT_RADIUS);

  const uid = `gr1-orbit-${++GRADIENT_SEED}`;
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
        {/* The mark — slow continuous rotation. */}
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={{ rotate: 360 }}
          transition={{ duration: MARK_SPIN_DUR, repeat: Infinity, ease: 'linear' }}
        >
          {GR1_PATHS.map((d, i) => (
            <path key={i} d={d} fill={color} />
          ))}
        </motion.g>

        {/* Satellite — orbits the mark center via parametric cx/cy. */}
        <motion.circle cx={cx} cy={cy} r={DOT_RADIUS} fill={color} />
      </g>
    </svg>
  );
}
