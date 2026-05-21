import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CIRCLE_CX,
  CIRCLE_CY,
  CIRCLE_LEN,
  CIRCLE_R,
  LINE_D,
  LINE_LEN,
  VIEWBOX,
  VIEWBOX_SIZE,
} from '../logo/GrowwLogoPath';
import type { LoaderProps } from './types';

export type LoaderVariant =
  | 'trace'
  | 'pulse'
  | 'orbit'
  | 'orbit-flow'
  | 'dual-orbit'
  | 'sync-orbit'
  | 'assemble'
  | 'sync-assemble'
  | 'echo'
  | 'echo-pulse'
  | 'bounce'
  | 'float'
  | 'breathe'
  | 'zoom-in'
  | 'zoom-out'
  | 'stagger-trace';

interface Props extends LoaderProps {
  variant: LoaderVariant;
}

const DRAW_EASE = [0.32, 0.72, 0, 1] as const;
const PULSE_EASE = [0.45, 0, 0.55, 1] as const;

/**
 * Given durations summing to total, return times[] in 0..1 marking the end
 * of each segment. The values[] arg matches each keyframe position.
 */
function timesFromDurations(durations: number[]): number[] {
  const total = durations.reduce((a, b) => a + b, 0);
  const times: number[] = [0];
  let acc = 0;
  for (const d of durations) {
    acc += d;
    times.push(acc / total);
  }
  return times;
}

export function BrandedLogoLoader({
  size = 96,
  color = '#FFFFFF',
  variant,
}: Props) {
  const strokeWidth = VIEWBOX_SIZE / size;
  return useMemo(() => {
    switch (variant) {
      case 'trace':
        return <Trace size={size} color={color} strokeWidth={strokeWidth} />;
      case 'pulse':
        return <Pulse size={size} color={color} strokeWidth={strokeWidth} />;
      case 'orbit':
        return <Orbit size={size} color={color} strokeWidth={strokeWidth} />;
      case 'orbit-flow':
        return <OrbitFlow size={size} color={color} strokeWidth={strokeWidth} />;
      case 'dual-orbit':
        return <DualOrbit size={size} color={color} strokeWidth={strokeWidth} />;
      case 'sync-orbit':
        return <SyncOrbit size={size} color={color} strokeWidth={strokeWidth} />;
      case 'assemble':
        return <Assemble size={size} color={color} strokeWidth={strokeWidth} />;
      case 'sync-assemble':
        return <SyncAssemble size={size} color={color} strokeWidth={strokeWidth} />;
      case 'echo':
        return <Echo size={size} color={color} strokeWidth={strokeWidth} pulse={false} />;
      case 'echo-pulse':
        return <Echo size={size} color={color} strokeWidth={strokeWidth} pulse />;
      case 'bounce':
        return <Bounce size={size} color={color} strokeWidth={strokeWidth} />;
      case 'float':
        return <Float size={size} color={color} strokeWidth={strokeWidth} />;
      case 'breathe':
        return <Breathe size={size} color={color} strokeWidth={strokeWidth} />;
      case 'zoom-in':
        return <ZoomIn size={size} color={color} strokeWidth={strokeWidth} />;
      case 'zoom-out':
        return <ZoomOut size={size} color={color} strokeWidth={strokeWidth} />;
      case 'stagger-trace':
        return <StaggerTrace size={size} color={color} strokeWidth={strokeWidth} />;
    }
  }, [size, color, strokeWidth, variant]);
}

interface VProps {
  size: number;
  color: string;
  strokeWidth: number;
}

// ─── trace ──────────────────────────────────────────────────────────────────
function Trace({ size, color, strokeWidth }: VProps) {
  const drawDur = 1.1;
  const holdDur = 0.35;
  const eraseDur = 0.8;
  const stagger = 0.22;

  // Circle (leads): 0 → draw → hold+stagger → erase. Total = drawDur + holdDur + stagger + eraseDur
  const cTotal = drawDur + holdDur + stagger + eraseDur;
  const cTimes = timesFromDurations([drawDur, holdDur + stagger, eraseDur]);
  const cValues = [CIRCLE_LEN, 0, 0, CIRCLE_LEN];

  // Line (trails): stagger delay then draw → hold → stagger+erase
  const lTotal = stagger + drawDur + holdDur + stagger + eraseDur - stagger; // = cTotal
  const lTimes = timesFromDurations([stagger, drawDur, holdDur, eraseDur]);
  const lValues = [LINE_LEN, LINE_LEN, 0, 0, LINE_LEN];

  void lTotal;

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <motion.circle
        cx={CIRCLE_CX}
        cy={CIRCLE_CY}
        r={CIRCLE_R}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={CIRCLE_LEN}
        animate={{ strokeDashoffset: cValues }}
        transition={{
          duration: cTotal,
          times: cTimes,
          repeat: Infinity,
          ease: DRAW_EASE,
        }}
      />
      <motion.path
        d={LINE_D}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={LINE_LEN}
        animate={{ strokeDashoffset: lValues }}
        transition={{
          duration: cTotal,
          times: lTimes,
          repeat: Infinity,
          ease: DRAW_EASE,
        }}
      />
    </svg>
  );
}

// ─── pulse ──────────────────────────────────────────────────────────────────
function Pulse({ size, color, strokeWidth }: VProps) {
  const beat = 0.22;
  const rest = 0.9;
  const durations = [beat, beat, beat, beat, rest];
  const total = durations.reduce((a, b) => a + b, 0);
  const times = timesFromDurations(durations);
  const scale = [1, 1.12, 1.0, 1.08, 1.0, 1.0];
  const opacity = [1, 0.7, 1.0, 0.75, 1.0, 1.0];

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      animate={{ scale, opacity }}
      transition={{
        duration: total,
        times,
        repeat: Infinity,
        ease: PULSE_EASE,
      }}
    >
      <LogoMark color={color} strokeWidth={strokeWidth} size={size} />
    </motion.div>
  );
}

// ─── orbit ──────────────────────────────────────────────────────────────────
function Orbit({ size, color, strokeWidth }: VProps) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg
        width={size}
        height={size}
        viewBox={VIEWBOX}
        fill="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        <path
          d={LINE_D}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <motion.div
        style={{ position: 'absolute', inset: 0, transformOrigin: 'center' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
      >
        <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
          <circle
            cx={CIRCLE_CX}
            cy={CIRCLE_CY}
            r={CIRCLE_R}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${CIRCLE_LEN * 0.25}, ${CIRCLE_LEN * 0.75}`}
          />
        </svg>
      </motion.div>
    </div>
  );
}

// ─── orbit-flow ─────────────────────────────────────────────────────────────
function OrbitFlow({ size, color, strokeWidth }: VProps) {
  const arcDur = 1.4;
  const lineFlowDur = 4.2;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg
        width={size}
        height={size}
        viewBox={VIEWBOX}
        fill="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        <motion.path
          d={LINE_D}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={`${strokeWidth * 2.2}, ${strokeWidth * 2.6}`}
          animate={{ strokeDashoffset: [0, -LINE_LEN] }}
          transition={{ duration: lineFlowDur, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      <motion.div
        style={{ position: 'absolute', inset: 0, transformOrigin: 'center' }}
        animate={{ rotate: 360 }}
        transition={{ duration: arcDur, repeat: Infinity, ease: 'linear' }}
      >
        <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
          <circle
            cx={CIRCLE_CX}
            cy={CIRCLE_CY}
            r={CIRCLE_R}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${CIRCLE_LEN * 0.25}, ${CIRCLE_LEN * 0.75}`}
          />
        </svg>
      </motion.div>
    </div>
  );
}

// ─── dual-orbit ─────────────────────────────────────────────────────────────
function DualOrbit({ size, color, strokeWidth }: VProps) {
  const dur = 1.3;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg
        width={size}
        height={size}
        viewBox={VIEWBOX}
        fill="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        <motion.path
          d={LINE_D}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={`${LINE_LEN * 0.25}, ${LINE_LEN}`}
          animate={{ strokeDashoffset: [LINE_LEN, -LINE_LEN] }}
          transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      <motion.div
        style={{ position: 'absolute', inset: 0, transformOrigin: 'center' }}
        animate={{ rotate: 360 }}
        transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
      >
        <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
          <circle
            cx={CIRCLE_CX}
            cy={CIRCLE_CY}
            r={CIRCLE_R}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${CIRCLE_LEN * 0.25}, ${CIRCLE_LEN * 0.75}`}
          />
        </svg>
      </motion.div>
    </div>
  );
}

// ─── sync-orbit ─────────────────────────────────────────────────────────────
function SyncOrbit({ size, color, strokeWidth }: VProps) {
  const dur = 1.5;
  const segLen = LINE_LEN * 0.3;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg
        width={size}
        height={size}
        viewBox={VIEWBOX}
        fill="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        <motion.path
          d={LINE_D}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={`${segLen}, ${LINE_LEN * 2}`}
          animate={{ strokeDashoffset: [segLen, -LINE_LEN] }}
          transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      <motion.div
        style={{ position: 'absolute', inset: 0, transformOrigin: 'center' }}
        animate={{ rotate: 360 }}
        transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
      >
        <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
          <circle
            cx={CIRCLE_CX}
            cy={CIRCLE_CY}
            r={CIRCLE_R}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${CIRCLE_LEN * 0.25}, ${CIRCLE_LEN * 0.75}`}
          />
        </svg>
      </motion.div>
    </div>
  );
}

// ─── assemble ───────────────────────────────────────────────────────────────
function Assemble({ size, color, strokeWidth }: VProps) {
  const spinDur = 1.1;
  const growDur = 0.7;
  const pauseDur = 0.5;
  const drawDur = 0.7;
  const holdDur = 0.8;
  const fadeDur = 0.4;
  const spinPhase = spinDur * 2;
  const total = spinPhase + growDur + pauseDur + drawDur + holdDur + fadeDur;

  const tSpinEnd = spinPhase / total;
  const tGrowEnd = (spinPhase + growDur) / total;
  const tDrawStart = (spinPhase + growDur + pauseDur) / total;
  const tDrawEnd = (spinPhase + growDur + pauseDur + drawDur) / total;
  const tHoldEnd = (spinPhase + growDur + pauseDur + drawDur + holdDur) / total;

  // Arc: 25% dash to full circle
  const arcDashValues = [
    `${CIRCLE_LEN * 0.25}, ${CIRCLE_LEN * 0.75}`,
    `${CIRCLE_LEN * 0.25}, ${CIRCLE_LEN * 0.75}`,
    `${CIRCLE_LEN}, 0`,
    `${CIRCLE_LEN}, 0`,
    `${CIRCLE_LEN}, 0`,
  ];

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <motion.svg
        width={size}
        height={size}
        viewBox={VIEWBOX}
        fill="none"
        style={{ position: 'absolute', inset: 0 }}
        animate={{ opacity: [1, 1, 1, 1, 0, 1] }}
        transition={{
          duration: total,
          times: [0, tSpinEnd, tGrowEnd, tHoldEnd, 1, 1],
          repeat: Infinity,
        }}
      >
        <motion.path
          d={LINE_D}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={LINE_LEN}
          animate={{
            strokeDashoffset: [LINE_LEN, LINE_LEN, LINE_LEN, 0, 0, LINE_LEN],
          }}
          transition={{
            duration: total,
            times: [0, tSpinEnd, tDrawStart, tDrawEnd, tHoldEnd, 1],
            repeat: Infinity,
            ease: DRAW_EASE,
          }}
        />
      </motion.svg>
      <motion.div
        style={{ position: 'absolute', inset: 0, transformOrigin: 'center' }}
        animate={{ rotate: [0, 720, 900, 900, 900] }}
        transition={{
          duration: total,
          times: [0, tSpinEnd, tGrowEnd, tHoldEnd, 1],
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <motion.svg
          width={size}
          height={size}
          viewBox={VIEWBOX}
          fill="none"
          animate={{ opacity: [1, 1, 1, 1, 0, 1] }}
          transition={{
            duration: total,
            times: [0, tSpinEnd, tGrowEnd, tHoldEnd, 1, 1],
            repeat: Infinity,
          }}
        >
          <motion.circle
            cx={CIRCLE_CX}
            cy={CIRCLE_CY}
            r={CIRCLE_R}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            animate={{ strokeDasharray: arcDashValues }}
            transition={{
              duration: total,
              times: [0, tSpinEnd, tGrowEnd, tHoldEnd, 1],
              repeat: Infinity,
              ease: PULSE_EASE,
            }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}

// ─── sync-assemble ──────────────────────────────────────────────────────────
function SyncAssemble({ size, color, strokeWidth }: VProps) {
  const cycleDur = 1.3;
  const cycles = 2;
  const loadingDur = cycleDur * cycles;
  const formDur = 0.7;
  const holdDur = 0.8;
  const fadeDur = 0.4;
  const segLen = LINE_LEN * 0.3;
  const total = loadingDur + formDur + holdDur + fadeDur;

  // Wrapper opacity fade at end
  const opacityValues = [1, 1, 1, 0, 1];
  const opacityTimes = [0, loadingDur / total, (loadingDur + formDur + holdDur) / total, 1, 1];

  // Arc dashArray grows from 25% to 100% during form phase
  const arcDashValues = [
    `${CIRCLE_LEN * 0.25}, ${CIRCLE_LEN * 0.75}`,
    `${CIRCLE_LEN * 0.25}, ${CIRCLE_LEN * 0.75}`,
    `${CIRCLE_LEN}, 0`,
    `${CIRCLE_LEN}, 0`,
  ];
  const arcDashTimes = [0, loadingDur / total, (loadingDur + formDur) / total, 1];

  // Arc rotation: 720° in loading, +180° during form, hold
  const rotateValues = [0, 360 * cycles, 360 * cycles + 180, 360 * cycles + 180];
  const rotateTimes = [0, loadingDur / total, (loadingDur + formDur) / total, 1];

  // Line: dasharray short during loading, grows during form. Offset moves during loading.
  // We use a simpler dual approach: during loading, paint a segment that orbits;
  // during form, swap to full line dasharray and snap offset to 0.
  const lineDashValues = [
    `${segLen}, ${LINE_LEN * 2}`,
    `${segLen}, ${LINE_LEN * 2}`,
    `${LINE_LEN}, 0`,
    `${LINE_LEN}, 0`,
  ];

  // Offset traverses LINE_LEN per loading cycle (segLen → -LINE_LEN, repeated `cycles` times),
  // then locks at 0.
  const lineOffsetValues: number[] = [segLen];
  for (let i = 0; i < cycles; i++) {
    lineOffsetValues.push(-LINE_LEN + i * 0);
    lineOffsetValues.push(segLen);
  }
  // Replace the last `segLen` reset with locked-at-0 for the rest of the cycle.
  lineOffsetValues[lineOffsetValues.length - 1] = 0;
  lineOffsetValues.push(0); // form
  lineOffsetValues.push(0); // hold+fade

  // Build matching times for line offset
  const lineOffsetTimes: number[] = [0];
  for (let i = 0; i < cycles; i++) {
    const cycleEnd = ((i + 1) * cycleDur) / total;
    lineOffsetTimes.push(cycleEnd - 0.0001);
    lineOffsetTimes.push(cycleEnd);
  }
  lineOffsetTimes[lineOffsetTimes.length - 1] = loadingDur / total;
  lineOffsetTimes.push((loadingDur + formDur) / total);
  lineOffsetTimes.push(1);

  return (
    <motion.div
      style={{ width: size, height: size, position: 'relative' }}
      animate={{ opacity: opacityValues }}
      transition={{ duration: total, times: opacityTimes, repeat: Infinity }}
    >
      <svg
        width={size}
        height={size}
        viewBox={VIEWBOX}
        fill="none"
        style={{ position: 'absolute', inset: 0 }}
      >
        <motion.path
          d={LINE_D}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          animate={{
            strokeDasharray: lineDashValues,
            strokeDashoffset: lineOffsetValues,
          }}
          transition={{
            duration: total,
            times: arcDashTimes,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </svg>
      <motion.div
        style={{ position: 'absolute', inset: 0, transformOrigin: 'center' }}
        animate={{ rotate: rotateValues }}
        transition={{
          duration: total,
          times: rotateTimes,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
          <motion.circle
            cx={CIRCLE_CX}
            cy={CIRCLE_CY}
            r={CIRCLE_R}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            animate={{ strokeDasharray: arcDashValues }}
            transition={{
              duration: total,
              times: arcDashTimes,
              repeat: Infinity,
              ease: PULSE_EASE,
            }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ─── echo / echo-pulse ──────────────────────────────────────────────────────
function Echo({
  size,
  color,
  strokeWidth,
  pulse,
}: VProps & { pulse: boolean }) {
  const dur = 1.8;
  const maxRadius = CIRCLE_R * 1.6;
  const echoExpand = 14;
  const expandedViewBoxSize = VIEWBOX_SIZE + echoExpand * 2;
  const expandedViewBox = `${-4 - echoExpand} ${-4 - echoExpand} ${expandedViewBoxSize} ${expandedViewBoxSize}`;
  const renderSize = size * (expandedViewBoxSize / VIEWBOX_SIZE);

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
      animate={
        pulse
          ? {
              scale: [1, 0.94, 1],
              opacity: [1, 0.78, 1],
            }
          : undefined
      }
      transition={
        pulse
          ? {
              duration: dur,
              times: [0, 0.15, 1],
              repeat: Infinity,
              ease: PULSE_EASE,
            }
          : undefined
      }
    >
      <svg
        width={renderSize}
        height={renderSize}
        viewBox={expandedViewBox}
        fill="none"
        style={{ position: 'absolute' }}
      >
        <defs>
          <mask id={`echoMask-${pulse ? 'p' : 'n'}`}>
            <circle
              cx={CIRCLE_CX}
              cy={CIRCLE_CY}
              r={CIRCLE_R * 1.65}
              fill="white"
            />
          </mask>
        </defs>
        <g mask={`url(#echoMask-${pulse ? 'p' : 'n'})`}>
          <motion.circle
            cx={CIRCLE_CX}
            cy={CIRCLE_CY}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            animate={{
              r: [CIRCLE_R, maxRadius],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: dur,
              times: [0, 0.15, 1],
              repeat: Infinity,
              ease: PULSE_EASE,
            }}
          />
        </g>
        <circle
          cx={CIRCLE_CX}
          cy={CIRCLE_CY}
          r={CIRCLE_R}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <path
          d={LINE_D}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}

// ─── bounce ─────────────────────────────────────────────────────────────────
function Bounce({ size, color, strokeWidth }: VProps) {
  const fallDur = 0.55;
  const holdDur = 0.45;
  const liftDur = 0.55;
  const total = fallDur + holdDur + liftDur;

  const tFallEnd = fallDur / total;
  const tHoldEnd = (fallDur + holdDur) / total;

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      animate={{
        y: [-8, 0, 0, -8],
      }}
      transition={{
        duration: total,
        times: [0, tFallEnd, tHoldEnd, 1],
        repeat: Infinity,
        ease: PULSE_EASE,
      }}
    >
      <LogoMark color={color} strokeWidth={strokeWidth} size={size} />
    </motion.div>
  );
}

// ─── float ──────────────────────────────────────────────────────────────────
function Float({ size, color, strokeWidth }: VProps) {
  const yDur = 2.2;
  const xDur = yDur * 2;
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{
          duration: yDur,
          repeat: Infinity,
          ease: PULSE_EASE,
        }}
      >
        <motion.div
          animate={{ x: [2, -2, 2] }}
          transition={{
            duration: xDur,
            repeat: Infinity,
            ease: PULSE_EASE,
          }}
        >
          <LogoMark color={color} strokeWidth={strokeWidth} size={size} />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── spin · removed ────────────────────────────────────────────────────────
// ─── flip · removed ────────────────────────────────────────────────────────
// ─── morse · removed ───────────────────────────────────────────────────────
// ─── shutter · removed ─────────────────────────────────────────────────────
// ─── wobble · removed ──────────────────────────────────────────────────────

// ─── breathe ────────────────────────────────────────────────────────────────
// Soft slow scale + opacity — a calm "thinking" loop.
function Breathe({ size, color, strokeWidth }: VProps) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transformOrigin: 'center',
      }}
      animate={{ scale: [0.92, 1.05, 0.92], opacity: [0.55, 1, 0.55] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: PULSE_EASE }}
    >
      <LogoMark color={color} strokeWidth={strokeWidth} size={size} />
    </motion.div>
  );
}

// ─── zoom-in ────────────────────────────────────────────────────────────────
// Logo appears from far (scale 0.2, low opacity) and zooms forward, holds, resets.
function ZoomIn({ size, color, strokeWidth }: VProps) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transformOrigin: 'center',
      }}
      animate={{
        scale: [0.2, 1, 1, 1.4, 0.2],
        opacity: [0, 1, 1, 0, 0],
      }}
      transition={{
        duration: 2.4,
        times: [0, 0.35, 0.65, 0.9, 1],
        repeat: Infinity,
        ease: PULSE_EASE,
      }}
    >
      <LogoMark color={color} strokeWidth={strokeWidth} size={size} />
    </motion.div>
  );
}

// ─── zoom-out ───────────────────────────────────────────────────────────────
// Mirror of zoom-in: logo enters from very close (scale 1.4, transparent),
// settles to full size, holds, then shrinks into the distance and fades out
// before the cycle resets.
function ZoomOut({ size, color, strokeWidth }: VProps) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transformOrigin: 'center',
      }}
      animate={{
        scale: [1.4, 1, 1, 0.2, 1.4],
        opacity: [0, 1, 1, 0, 0],
      }}
      transition={{
        duration: 2.4,
        times: [0, 0.35, 0.65, 0.9, 1],
        repeat: Infinity,
        ease: PULSE_EASE,
      }}
    >
      <LogoMark color={color} strokeWidth={strokeWidth} size={size} />
    </motion.div>
  );
}

// ─── stagger-trace ──────────────────────────────────────────────────────────
// Like trace, but the line draws from BOTH ends inward simultaneously,
// while the circle traces in one sweep. Holds, fades together.
function StaggerTrace({ size, color, strokeWidth }: VProps) {
  const drawDur = 1.0;
  const holdDur = 0.5;
  const fadeDur = 0.6;
  const total = drawDur + holdDur + fadeDur;
  const t = [0, drawDur / total, (drawDur + holdDur) / total, 1];

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <motion.circle
        cx={CIRCLE_CX}
        cy={CIRCLE_CY}
        r={CIRCLE_R}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={CIRCLE_LEN}
        animate={{
          strokeDashoffset: [CIRCLE_LEN, 0, 0, CIRCLE_LEN],
          opacity: [1, 1, 1, 0],
        }}
        transition={{ duration: total, times: t, repeat: Infinity, ease: DRAW_EASE }}
      />
      {/* Line drawn from start */}
      <motion.path
        d={LINE_D}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={`${LINE_LEN / 2}, ${LINE_LEN}`}
        animate={{
          strokeDashoffset: [LINE_LEN / 2, 0, 0, LINE_LEN / 2],
          opacity: [1, 1, 1, 0],
        }}
        transition={{ duration: total, times: t, repeat: Infinity, ease: DRAW_EASE }}
      />
      {/* Line drawn from end (mirrored offset) */}
      <motion.path
        d={LINE_D}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={`${LINE_LEN / 2}, ${LINE_LEN}`}
        animate={{
          strokeDashoffset: [-LINE_LEN, -LINE_LEN / 2, -LINE_LEN / 2, -LINE_LEN],
          opacity: [1, 1, 1, 0],
        }}
        transition={{ duration: total, times: t, repeat: Infinity, ease: DRAW_EASE }}
      />
    </svg>
  );
}

// ─── Static logo mark ───────────────────────────────────────────────────────
function LogoMark({
  size,
  color,
  strokeWidth,
}: {
  size: number;
  color: string;
  strokeWidth: number;
}) {
  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <circle
        cx={CIRCLE_CX}
        cy={CIRCLE_CY}
        r={CIRCLE_R}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <path
        d={LINE_D}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
