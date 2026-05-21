import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import {
  AREA_D,
  CIRCLE_CX,
  CIRCLE_CY,
  CIRCLE_LEN,
  CIRCLE_R,
  LINE_D,
  LINE_LEN,
  RAW_VIEWBOX_SIZE,
  VIEWBOX,
} from '../logo/GrowwLogoPath';
import type { LoaderProps } from './types';

export type ChartVariant =
  | 'fill'
  | 'rise'
  | 'sweep'
  | 'trace-fill'
  | 'bars'
  | 'scan-bar'
  | 'scan-bar-bounce'
  | 'ripple'
  | 'bloom'
  | 'stagger-fill'
  | 'drip'
  | 'heartbeat';

interface Props extends LoaderProps {
  variant: ChartVariant;
  fillColor?: string;
  fillOpacity?: number;
}

const DRAW_EASE = [0.32, 0.72, 0, 1] as const;
const PULSE_EASE = [0.45, 0, 0.55, 1] as const;

const LINE_X_START = 2.15;
const LINE_X_END = 30.8;
const PEAK_X = 30.8;
const PEAK_Y = 8.9;
const BAR_COUNT = 8;
const BAR_BOTTOM = RAW_VIEWBOX_SIZE;
const BAR_MAX_H = RAW_VIEWBOX_SIZE * 0.7;
const BAR_SLOT = RAW_VIEWBOX_SIZE / BAR_COUNT;
const BAR_GAP = BAR_SLOT * 0.25;
const BAR_W = BAR_SLOT - BAR_GAP;

export function ChartFillLoader({
  size = 96,
  color = '#FFFFFF',
  variant,
  fillColor,
  fillOpacity = 0.22,
}: Props) {
  const strokeWidth = (RAW_VIEWBOX_SIZE + 8) / size;
  const fill = fillColor ?? color;

  switch (variant) {
    case 'fill':
      return <FillVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
    case 'rise':
      return <RiseVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
    case 'sweep':
      return <SweepVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
    case 'trace-fill':
      return <TraceFillVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
    case 'bars':
      return <BarsVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
    case 'scan-bar':
      return <ScanBarVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
    case 'scan-bar-bounce':
      return <ScanBarBounceVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
    case 'ripple':
      return <RippleVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
    case 'bloom':
      return <BloomVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
    case 'stagger-fill':
      return <StaggerFillVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
    case 'drip':
      return <DripVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
    case 'heartbeat':
      return <HeartbeatVariant size={size} color={color} fill={fill} fillOpacity={fillOpacity} strokeWidth={strokeWidth} />;
  }
}

interface VProps {
  size: number;
  color: string;
  fill: string;
  fillOpacity: number;
  strokeWidth: number;
}

// ─── fill ───────────────────────────────────────────────────────────────────
function FillVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  const drawDur = 1.1;
  const fadeIn = 0.6;
  const hold = 0.8;
  const fadeOut = 0.6;
  const total = drawDur + fadeIn + hold + fadeOut;
  const t = [0, drawDur / total, (drawDur + fadeIn) / total, (drawDur + fadeIn + hold) / total, 1];

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="fill-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
      </defs>
      <g clipPath="url(#fill-circle-clip)">
        <motion.path
          d={AREA_D}
          fill={fill}
          animate={{ opacity: [0, 0, fillOpacity, fillOpacity, 0] }}
          transition={{ duration: total, times: t, repeat: Infinity, ease: PULSE_EASE }}
        />
      </g>
      <motion.circle
        cx={CIRCLE_CX}
        cy={CIRCLE_CY}
        r={CIRCLE_R}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={CIRCLE_LEN}
        animate={{ strokeDashoffset: [CIRCLE_LEN, 0, 0, 0, 0] }}
        transition={{ duration: total, times: t, repeat: Infinity, ease: DRAW_EASE }}
      />
      <motion.path
        d={LINE_D}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={LINE_LEN}
        animate={{ strokeDashoffset: [LINE_LEN, 0, 0, 0, 0] }}
        transition={{ duration: total, times: t, repeat: Infinity, ease: DRAW_EASE }}
      />
    </svg>
  );
}

// ─── rise ───────────────────────────────────────────────────────────────────
function RiseVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  const riseDur = 1.2;
  const hold = 0.6;
  const drainDur = 1.0;
  const total = riseDur + hold + drainDur;
  const t = [0, riseDur / total, (riseDur + hold) / total, 1];

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="rise-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
      </defs>
      <g clipPath="url(#rise-circle-clip)">
        <motion.g
          animate={{ y: [RAW_VIEWBOX_SIZE, 0, 0, RAW_VIEWBOX_SIZE] }}
          transition={{ duration: total, times: t, repeat: Infinity, ease: PULSE_EASE }}
        >
          <path d={AREA_D} fill={fill} opacity={fillOpacity} />
        </motion.g>
      </g>
      <Logo color={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

// ─── sweep ──────────────────────────────────────────────────────────────────
function SweepVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  const sweepDur = 1.4;
  const hold = 0.5;
  const clearDur = 0.7;
  const total = sweepDur + hold + clearDur;
  const t = [0, sweepDur / total, (sweepDur + hold) / total, 1];

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="sweep-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
        <clipPath id="sweep-rect-clip">
          <motion.rect
            x={0}
            y={0}
            height={RAW_VIEWBOX_SIZE}
            animate={{ width: [0, RAW_VIEWBOX_SIZE, RAW_VIEWBOX_SIZE, 0] }}
            transition={{ duration: total, times: t, repeat: Infinity, ease: PULSE_EASE }}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#sweep-circle-clip)">
        <g clipPath="url(#sweep-rect-clip)">
          <path d={AREA_D} fill={fill} opacity={fillOpacity} />
        </g>
      </g>
      <Logo color={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

// ─── trace-fill ─────────────────────────────────────────────────────────────
function TraceFillVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  const drawDur = 1.5;
  const hold = 0.7;
  const clearDur = 0.6;
  const total = drawDur + hold + clearDur;
  const t = [0, drawDur / total, (drawDur + hold) / total, 1];

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="tf-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
        <clipPath id="tf-rect-clip">
          <motion.rect
            x={0}
            y={0}
            height={RAW_VIEWBOX_SIZE}
            animate={{ width: [0, RAW_VIEWBOX_SIZE, RAW_VIEWBOX_SIZE, 0] }}
            transition={{ duration: total, times: t, repeat: Infinity, ease: DRAW_EASE }}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#tf-circle-clip)">
        <g clipPath="url(#tf-rect-clip)">
          <path d={AREA_D} fill={fill} opacity={fillOpacity} />
        </g>
      </g>
      <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} stroke={color} strokeWidth={strokeWidth} fill="none" />
      <motion.path
        d={LINE_D}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={LINE_LEN}
        animate={{ strokeDashoffset: [LINE_LEN, 0, 0, LINE_LEN] }}
        transition={{ duration: total, times: t, repeat: Infinity, ease: DRAW_EASE }}
      />
    </svg>
  );
}

// ─── bars ───────────────────────────────────────────────────────────────────
function BarsVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  const stagger = 0.09;
  const growDur = 0.55;
  const hold = 0.55;
  const dropDur = 0.45;
  const tail = 0.2;
  const perBarDur = growDur + hold + dropDur;
  const cycleDur = stagger * (BAR_COUNT - 1) + perBarDur + tail;

  // Frame ratios for the per-bar 4-keyframe scale (idle → grow → hold → drop)
  const tGrow = growDur / perBarDur;
  const tHold = (growDur + hold) / perBarDur;

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="bars-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
        <clipPath id="bars-area-clip"><path d={AREA_D} /></clipPath>
      </defs>
      <g clipPath="url(#bars-circle-clip)">
        <g clipPath="url(#bars-area-clip)">
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <motion.rect
              key={i}
              x={i * BAR_SLOT + BAR_GAP / 2}
              y={BAR_BOTTOM - BAR_MAX_H}
              width={BAR_W}
              height={BAR_MAX_H}
              fill={fill}
              opacity={fillOpacity}
              style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1, 1, 0] }}
              transition={{
                duration: perBarDur,
                times: [0, tGrow, tHold, 1],
                ease: PULSE_EASE,
                repeat: Infinity,
                repeatDelay: cycleDur - perBarDur,
                delay: i * stagger,
              }}
            />
          ))}
        </g>
      </g>
      <Logo color={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

// ─── scan-bar ───────────────────────────────────────────────────────────────
function ScanBarVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  const scanDur = 1.6;
  const hold = 0.4;
  const total = scanDur + hold;
  const t = [0, scanDur / total, 1];

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="sb-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
        {/* Fill clip's right edge tracks the scan bar's x position exactly,
            so the fill paints in *behind* the bar at the same rate. */}
        <clipPath id="sb-rect-clip">
          <motion.rect
            x={0}
            y={0}
            height={RAW_VIEWBOX_SIZE}
            animate={{ width: [LINE_X_START, LINE_X_END, LINE_X_END] }}
            transition={{ duration: total, times: t, repeat: Infinity, ease: PULSE_EASE }}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#sb-circle-clip)">
        <g clipPath="url(#sb-rect-clip)">
          <path d={AREA_D} fill={fill} opacity={fillOpacity} />
        </g>
      </g>
      <Logo color={color} strokeWidth={strokeWidth} />
      <g clipPath="url(#sb-circle-clip)">
        <motion.line
          y1={0}
          y2={RAW_VIEWBOX_SIZE}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          animate={{
            x1: [LINE_X_START, LINE_X_END, LINE_X_END],
            x2: [LINE_X_START, LINE_X_END, LINE_X_END],
          }}
          transition={{ duration: total, times: t, repeat: Infinity, ease: PULSE_EASE }}
        />
      </g>
    </svg>
  );
}

// ─── scan-bar-bounce ────────────────────────────────────────────────────────
// Forward scan paints the fill left→right; on the way back, the scan bar
// travels right→left and the fill drains behind it (cleared as the bar
// recedes), leaving an empty canvas for the next forward sweep.
function ScanBarBounceVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  const forwardDur = 1.4;
  const turnHold = 0.25;
  const backDur = 1.4;
  const total = forwardDur + turnHold + backDur;
  const tForwardEnd = forwardDur / total;
  const tTurnEnd = (forwardDur + turnHold) / total;
  const t = [0, tForwardEnd, tTurnEnd, 1];

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="sbb-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
        {/* Forward fill: rect's right edge tracks the scan bar's x position,
            so the fill paints in behind the bar on the way out and drains
            behind it on the way back. */}
        <clipPath id="sbb-fill-clip">
          <motion.rect
            x={0}
            y={0}
            height={RAW_VIEWBOX_SIZE}
            animate={{ width: [LINE_X_START, LINE_X_END, LINE_X_END, LINE_X_START] }}
            transition={{ duration: total, times: t, repeat: Infinity, ease: PULSE_EASE }}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#sbb-circle-clip)">
        <g clipPath="url(#sbb-fill-clip)">
          <path d={AREA_D} fill={fill} opacity={fillOpacity} />
        </g>
      </g>
      <Logo color={color} strokeWidth={strokeWidth} />
      <g clipPath="url(#sbb-circle-clip)">
        <motion.line
          y1={0}
          y2={RAW_VIEWBOX_SIZE}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          animate={{
            x1: [LINE_X_START, LINE_X_END, LINE_X_END, LINE_X_START],
            x2: [LINE_X_START, LINE_X_END, LINE_X_END, LINE_X_START],
          }}
          transition={{ duration: total, times: t, repeat: Infinity, ease: PULSE_EASE }}
        />
      </g>
    </svg>
  );
}
function RippleVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  const dur = 1.7;
  const maxR = CIRCLE_R * 0.9;
  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="ripple-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
      </defs>
      <g clipPath="url(#ripple-circle-clip)">
        <path d={AREA_D} fill={fill} opacity={fillOpacity} />
        <motion.circle
          cx={PEAK_X}
          cy={PEAK_Y}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          animate={{
            r: [0, maxR],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: dur,
            times: [0, 0.15, 1],
            repeat: Infinity,
            ease: PULSE_EASE,
          }}
        />
      </g>
      <Logo color={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

// ─── bloom ──────────────────────────────────────────────────────────────────
function BloomVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  const bloomDur = 1.2;
  const hold = 0.6;
  const fadeDur = 0.7;
  const total = bloomDur + hold + fadeDur;
  const t = [0, bloomDur / total, (bloomDur + hold) / total, 1];
  const maxR = RAW_VIEWBOX_SIZE * 1.1;
  const clipId = 'bloom-radial-clip';

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="bloom-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
        <clipPath id={clipId}>
          <motion.circle
            cx={PEAK_X}
            cy={PEAK_Y}
            animate={{ r: [0, maxR, maxR, maxR] }}
            transition={{ duration: total, times: t, repeat: Infinity, ease: DRAW_EASE }}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#bloom-circle-clip)">
        <g clipPath={`url(#${clipId})`}>
          <motion.path
            d={AREA_D}
            fill={fill}
            animate={{ opacity: [fillOpacity, fillOpacity, fillOpacity, 0] }}
            transition={{ duration: total, times: t, repeat: Infinity, ease: PULSE_EASE }}
          />
        </g>
      </g>
      <Logo color={color} strokeWidth={strokeWidth} />
      <motion.circle
        cx={PEAK_X}
        cy={PEAK_Y}
        r={strokeWidth * 1.6}
        fill={color}
        animate={{ scale: [0.6, 1.4, 1, 0.6], opacity: [0, 1, 0.9, 0] }}
        transition={{ duration: total, times: t, repeat: Infinity, ease: PULSE_EASE }}
        style={{ transformOrigin: `${PEAK_X}px ${PEAK_Y}px` }}
      />
    </svg>
  );
}

// ─── stagger-fill ───────────────────────────────────────────────────────────
function StaggerFillVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  const sliceCount = 6;
  const stagger = 0.11;
  const fadeDur = 0.45;
  const hold = 0.55;
  const clear = 0.55;
  const total = stagger * sliceCount + fadeDur + hold + clear;
  const sliceH = RAW_VIEWBOX_SIZE / sliceCount;

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="sf-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
        <clipPath id="sf-area-clip"><path d={AREA_D} /></clipPath>
      </defs>
      <g clipPath="url(#sf-circle-clip)">
        <g clipPath="url(#sf-area-clip)">
          {Array.from({ length: sliceCount }).map((_, i) => {
            // bottom slice fades first, top last
            const reverseIdx = sliceCount - 1 - i;
            const startIn = reverseIdx * stagger;
            const inEnd = startIn + fadeDur;
            const outStart = stagger * sliceCount + fadeDur + hold;
            const outEnd = outStart + clear;
            const t = [
              0,
              startIn / total,
              inEnd / total,
              outStart / total,
              outEnd / total,
              1,
            ];
            return (
              <motion.rect
                key={i}
                x={0}
                y={i * sliceH}
                width={RAW_VIEWBOX_SIZE}
                height={sliceH + 0.1}
                fill={fill}
                animate={{ opacity: [0, 0, fillOpacity, fillOpacity, 0, 0] }}
                transition={{ duration: total, times: t, repeat: Infinity, ease: PULSE_EASE }}
              />
            );
          })}
        </g>
      </g>
      <Logo color={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

// ─── drip ───────────────────────────────────────────────────────────────────
// Discrete droplets fall from above and land on the chart line at staggered x
// positions. Each droplet's landing pulse seeds the area fill, which builds up
// behind the drops as the cycle progresses, holds, then drains.
function DripVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  // Sample x along the chart-line, with the y of each landing point matching
  // the line at that x (eyeballed from LINE_D anchor points).
  const DROPS: ReadonlyArray<{ x: number; landY: number }> = [
    { x: 4.5, landY: 22.2 },
    { x: 9.0, landY: 18.7 },
    { x: 13.0, landY: 16.4 },
    { x: 17.0, landY: 18.0 },
    { x: 22.0, landY: 17.0 },
    { x: 27.5, landY: 12.2 },
  ];
  const dropDur = 0.55;
  const splashDur = 0.25;
  const stagger = 0.18;
  const lastStart = stagger * (DROPS.length - 1);
  const fillRise = 0.5;
  const hold = 0.5;
  const drain = 0.7;
  const total = lastStart + dropDur + splashDur + fillRise + hold + drain;

  // Area fill ramps up as drops land, holds, then drains.
  const tFillRiseStart = (lastStart + dropDur) / total;
  const tFillFull = (lastStart + dropDur + fillRise) / total;
  const tFillHoldEnd = (lastStart + dropDur + fillRise + hold) / total;
  const fillTimes = [0, tFillRiseStart, tFillFull, tFillHoldEnd, 1];

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="drip-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
      </defs>
      <g clipPath="url(#drip-circle-clip)">
        <motion.path
          d={AREA_D}
          fill={fill}
          animate={{ opacity: [0, 0, fillOpacity, fillOpacity, 0] }}
          transition={{ duration: total, times: fillTimes, repeat: Infinity, ease: PULSE_EASE }}
        />
        {DROPS.map((drop, i) => {
          const start = i * stagger;
          const landed = start + dropDur;
          const splashEnd = landed + splashDur;
          const fadeOutStart = tFillHoldEnd * total;
          const tDrop = [
            0,
            start / total,
            landed / total,
            splashEnd / total,
            Math.max(splashEnd / total, fadeOutStart / total),
            1,
          ];
          return (
            <g key={i}>
              {/* Falling droplet — from above the viewBox down to its landing y */}
              <motion.circle
                cx={drop.x}
                fill={color}
                animate={{
                  cy: [-3, -3, drop.landY, drop.landY, drop.landY, drop.landY],
                  r: [0.9, 0.9, 0.9, 0, 0, 0],
                  opacity: [0, 1, 1, 0, 0, 0],
                }}
                transition={{ duration: total, times: tDrop, repeat: Infinity, ease: PULSE_EASE }}
              />
              {/* Splash ring — brief expanding pulse at the landing point */}
              <motion.circle
                cx={drop.x}
                cy={drop.landY}
                stroke={color}
                strokeWidth={strokeWidth * 0.8}
                fill="none"
                animate={{
                  r: [0, 0, 0.4, 2.2, 2.2, 2.2],
                  opacity: [0, 0, 0.9, 0, 0, 0],
                }}
                transition={{ duration: total, times: tDrop, repeat: Infinity, ease: PULSE_EASE }}
              />
            </g>
          );
        })}
      </g>
      <Logo color={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

// ─── heartbeat ──────────────────────────────────────────────────────────────
// A glowing dot rides along the actual chart line from start to peak, painting
// the area fill behind it as it travels. Both the dot and the fill clip-rect
// are driven by a single shared motion value (`progress` 0→1), guaranteeing
// they stay frame-perfect in sync — no drift between two independent tweens.
function HeartbeatVariant({ size, color, fill, fillOpacity, strokeWidth }: VProps) {
  // Anchor points along LINE_D.
  const ANCHORS: ReadonlyArray<{ x: number; y: number }> = [
    { x: 2.15, y: 24.05 },
    { x: 11.86, y: 16.50 },
    { x: 13.90, y: 16.29 },
    { x: 18.36, y: 18.53 },
    { x: 20.50, y: 18.24 },
    { x: 30.80, y: 8.90 },
  ];

  const travelDur = 1.7;
  const hold = 0.5;
  const fadeDur = 0.6;
  const total = travelDur + hold + fadeDur;

  // Segment-length-proportional progress along the line, so the dot's apparent
  // speed feels consistent across bends.
  const segLens = ANCHORS.slice(1).map((p, i) => {
    const prev = ANCHORS[i];
    return Math.hypot(p.x - prev.x, p.y - prev.y);
  });
  const totalSegLen = segLens.reduce((s, v) => s + v, 0);
  const cum: number[] = [0];
  segLens.forEach((len) => cum.push(cum[cum.length - 1] + len));
  // travelStops[i] in [0,1] — the *travel-phase* fraction at which the dot
  // reaches anchor i.
  const travelStops = cum.map((c) => c / totalSegLen);

  const peakX = ANCHORS[ANCHORS.length - 1].x;
  const peakY = ANCHORS[ANCHORS.length - 1].y;

  // Single shared driver: 0 at cycle start → 1 at cycle end. Both the dot
  // position and the fill rect width derive from this with useTransform, so
  // they're literally reading the same value every frame.
  const progress = useMotionValue(0);

  // Map progress→travel-phase fraction (0..1 across the travel window, then
  // clamps at 1 during hold+fade so the dot/fill stay at the peak).
  const tTravelEnd = travelDur / total;
  const tFillFullSnap = (travelDur + 0.12) / total;
  const tHoldEnd = (travelDur + hold) / total;

  // Dot x/y: interpolate piecewise across anchor stops during travel, then
  // stay at peak.
  const progressBreakpoints = [
    0,
    ...travelStops.slice(1, -1).map((s) => s * tTravelEnd),
    tTravelEnd,
    tHoldEnd,
    1,
  ];
  const xValues = [
    ANCHORS[0].x,
    ...ANCHORS.slice(1, -1).map((a) => a.x),
    peakX,
    peakX,
    peakX,
  ];
  const yValues = [
    ANCHORS[0].y,
    ...ANCHORS.slice(1, -1).map((a) => a.y),
    peakY,
    peakY,
    peakY,
  ];
  const dotX = useTransform(progress, progressBreakpoints, xValues);
  const dotY = useTransform(progress, progressBreakpoints, yValues);

  // Fill rect width — matches dot x during travel, then snaps to full width
  // just after the dot lands at the peak so the lower-right corner fills.
  const fillBreakpoints = [
    0,
    ...travelStops.slice(1, -1).map((s) => s * tTravelEnd),
    tTravelEnd,
    tFillFullSnap,
    1,
  ];
  const fillValues = [
    ANCHORS[0].x,
    ...ANCHORS.slice(1, -1).map((a) => a.x),
    peakX,
    RAW_VIEWBOX_SIZE,
    RAW_VIEWBOX_SIZE,
  ];
  const fillW = useTransform(progress, fillBreakpoints, fillValues);

  // Opacity for the dot and the fill — both fade in the fade window.
  const dotOpacity = useTransform(progress, [0, tHoldEnd, 1], [1, 1, 0]);
  const fillOpacityMV = useTransform(progress, [0, tHoldEnd, 1], [fillOpacity, fillOpacity, 0]);

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: total,
      ease: 'linear',
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [progress, total]);

  return (
    <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
      <defs>
        <clipPath id="hb-circle-clip"><circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} /></clipPath>
        <clipPath id="hb-track-clip">
          <motion.rect x={0} y={0} height={RAW_VIEWBOX_SIZE} style={{ width: fillW }} />
        </clipPath>
        <filter id="hb-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g clipPath="url(#hb-circle-clip)">
        <g clipPath="url(#hb-track-clip)">
          <motion.path d={AREA_D} fill={fill} style={{ opacity: fillOpacityMV }} />
        </g>
      </g>
      <Logo color={color} strokeWidth={strokeWidth} />
      <g clipPath="url(#hb-circle-clip)">
        <motion.circle
          r={strokeWidth * 1.6}
          fill={color}
          filter="url(#hb-glow)"
          style={{ cx: dotX, cy: dotY, opacity: dotOpacity }}
        />
      </g>
    </svg>
  );
}


function Logo({ color, strokeWidth }: { color: string; strokeWidth: number }) {
  return (
    <>
      <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} stroke={color} strokeWidth={strokeWidth} fill="none" />
      <path d={LINE_D} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  );
}
