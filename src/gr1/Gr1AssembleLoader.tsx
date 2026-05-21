import { motion } from 'framer-motion';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// Approximate radial angle (in degrees) of each arc segment's home centroid
// from the mark's center. Used to send each piece flying in from outside
// along its own radial direction, then return to home.
const SEGMENT_ANGLES_DEG = [-20, 160, 100, -80, -140, 40] as const;
const ENTRY_DISTANCE = 18; // SVG units beyond home, far past the viewBox edge

// ─── assemble ───────────────────────────────────────────────────────────────
// Each arc enters from outside the viewBox along its own radial direction
// (away from the center), staggered, fading in as it lands. Once all six
// pieces have assembled into the logo, the full mark holds briefly, then
// disperses outward again and the cycle repeats.
let GRADIENT_SEED = 0;

export function Gr1AssembleLoader({ size = 96, color = '#04B488' }: Props) {
  const entryDur = 0.8;
  const stagger = 0.09;
  const hold = 0.9;
  const exitDur = 0.55;
  const totalEntries = stagger * (GR1_PATHS.length - 1) + entryDur;
  const total = totalEntries + hold + exitDur;
  const tHoldEnd = (totalEntries + hold) / total;

  const uid = `gr1-assemble-${++GRADIENT_SEED}`;
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
        <mask id={maskId} maskUnits="userSpaceOnUse" x={-GR1_RAW_SIZE} y={-GR1_RAW_SIZE} width={GR1_RAW_SIZE * 3} height={GR1_RAW_SIZE * 3}>
          <rect x={0} y={0} width={GR1_RAW_SIZE} height={GR1_RAW_SIZE} fill={`url(#${gradId})`} />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        {GR1_PATHS.map((d, i) => {
          const angleRad = (SEGMENT_ANGLES_DEG[i] * Math.PI) / 180;
          const dx = Math.cos(angleRad) * ENTRY_DISTANCE;
          const dy = Math.sin(angleRad) * ENTRY_DISTANCE;
          const entryStart = i * stagger;
          const entryEnd = entryStart + entryDur;
          const t = [
            0,
            entryStart / total,
            entryEnd / total,
            tHoldEnd,
            1,
          ];
          return (
            <motion.path
              key={i}
              d={d}
              fill={color}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              animate={{
                x: [dx, dx, 0, 0, dx],
                y: [dy, dy, 0, 0, dy],
                opacity: [0, 0, 1, 1, 0],
                scale: [0.6, 0.6, 1, 1, 0.6],
              }}
              transition={{
                duration: total,
                times: t,
                repeat: Infinity,
                ease: [0.32, 0.72, 0, 1],
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}
