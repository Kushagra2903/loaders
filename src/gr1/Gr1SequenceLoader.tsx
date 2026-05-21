import { motion } from 'framer-motion';
import { GR1_CENTER, GR1_PATHS, GR1_RAW_SIZE, GR1_VIEWBOX } from './Gr1LogoPath';

interface Props {
  size?: number;
  color?: string;
}

// Same radial angles as Assemble — each segment flies in along its own radial
// from outside the viewBox.
const SEGMENT_ANGLES_DEG = [-20, 160, 100, -80, -140, 40] as const;
const ENTRY_DISTANCE = 18;

// Visual reveal order — not the same as path index. Reads as a single sweep
// around the orbit (top → upper-left → lower-left → bottom → lower-right →
// upper-right) so the build feels like one continuous motion rather than
// scrambled pieces.
const REVEAL_ORDER: number[] = [0, 5, 2, 1, 4, 3];

// ─── sequence ───────────────────────────────────────────────────────────────
// Built on Assemble's fly-in geometry, but with a much larger stagger and a
// slower per-segment entry so each node clearly arrives, settles, and is
// visible before the next one starts moving. Reads as the mark being drawn
// piece by piece — like the assistant assembling its identity step by step.
let GRADIENT_SEED = 0;

export function Gr1SequenceLoader({ size = 96, color = '#04B488' }: Props) {
  const entryDur = 0.85;
  const stagger = 0.32;
  const hold = 0.6;
  const exitDur = 0.85;
  const exitStagger = 0.32;
  const totalEntries = stagger * (GR1_PATHS.length - 1) + entryDur;
  const totalExits = exitStagger * (GR1_PATHS.length - 1) + exitDur;
  const total = totalEntries + hold + totalExits;
  // Soft cubic ease — gentler than DRAW_EASE; reads as a calm fade-and-drift.
  const SMOOTH: [number, number, number, number] = [0.4, 0, 0.2, 1];

  const uid = `gr1-seq-${++GRADIENT_SEED}`;
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
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={-GR1_RAW_SIZE}
          y={-GR1_RAW_SIZE}
          width={GR1_RAW_SIZE * 3}
          height={GR1_RAW_SIZE * 3}
        >
          <rect x={0} y={0} width={GR1_RAW_SIZE} height={GR1_RAW_SIZE} fill={`url(#${gradId})`} />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        {GR1_PATHS.map((d, pathIdx) => {
          const angleRad = (SEGMENT_ANGLES_DEG[pathIdx] * Math.PI) / 180;
          const dx = Math.cos(angleRad) * ENTRY_DISTANCE;
          const dy = Math.sin(angleRad) * ENTRY_DISTANCE;
          const slot = REVEAL_ORDER.indexOf(pathIdx);
          // Entry window
          const entryStart = slot * stagger;
          const entryEnd = entryStart + entryDur;
          // Exit window — same slot order (first-in, first-out) so the
          // sequence continues forward around the orbit on the way out.
          const exitStart = totalEntries + hold + slot * exitStagger;
          const exitEnd = exitStart + exitDur;
          const t = [
            0,
            entryStart / total,
            entryEnd / total,
            exitStart / total,
            exitEnd / total,
            1,
          ];
          return (
            <motion.path
              key={pathIdx}
              d={d}
              fill={color}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              animate={{
                x: [dx, dx, 0, 0, -dx * 0.6, -dx * 0.6],
                y: [dy, dy, 0, 0, -dy * 0.6, -dy * 0.6],
                opacity: [0, 0, 1, 1, 0, 0],
                scale: [0.72, 0.72, 1, 1, 0.72, 0.72],
              }}
              transition={{
                duration: total,
                times: t,
                repeat: Infinity,
                ease: SMOOTH,
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}
