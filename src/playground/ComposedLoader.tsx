import { motion, type Easing } from 'framer-motion';
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
import { EASING_VALUES, type LoaderConfig } from './types';

interface Props {
  size: number;
  config: LoaderConfig;
}

function ease(key: keyof typeof EASING_VALUES): Easing | Easing[] {
  return EASING_VALUES[key] as Easing | Easing[];
}

export function ComposedLoader({ size, config }: Props) {
  const { circle, line, area, transform, draw, fill, echo, glow } = config;
  const filterStyle = glow.enabled
    ? { filter: `drop-shadow(0 0 ${glow.intensity * 0.16}px ${glow.color})` }
    : undefined;

  return (
    <TransformLayer config={transform} size={size}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {echo.enabled && (
          <EchoLayer size={size} echo={echo} />
        )}
        <svg
          width={size}
          height={size}
          viewBox={VIEWBOX}
          fill="none"
          style={{ position: 'absolute', inset: 0, ...filterStyle }}
        >
          <defs>
            <clipPath id="composed-area-clip">
              <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} />
            </clipPath>
          </defs>

          {area.visible && (
            <g clipPath="url(#composed-area-clip)">
              <FillLayer area={area} fill={fill} />
            </g>
          )}

          {circle.visible && <CircleElement circle={circle} draw={draw} />}
          {line.visible && <LineElement line={line} draw={draw} />}
        </svg>

        {draw.type === 'arc-orbit' && circle.visible && (
          <ArcOrbitOverlay size={size} circle={circle} draw={draw} />
        )}
      </div>
    </TransformLayer>
  );
}

// ─── Transform wrapper ───────────────────────────────────────────────────────
function TransformLayer({
  config,
  size,
  children,
}: {
  config: LoaderConfig['transform'];
  size: number;
  children: React.ReactNode;
}) {
  const sec = config.durationMs / 1000;
  const amp = config.amplitude / 100;
  const wrapper = {
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transformOrigin: 'center',
  } as const;

  switch (config.type) {
    case 'none':
      return <div style={wrapper}>{children}</div>;
    case 'rotate':
      return (
        <motion.div
          style={wrapper}
          animate={{ rotate: config.reverse ? -360 : 360 }}
          transition={{ duration: sec, repeat: Infinity, ease: 'linear' }}
        >
          {children}
        </motion.div>
      );
    case 'pulse': {
      const scale = 1 + 0.18 * amp;
      return (
        <motion.div
          style={wrapper}
          animate={{ scale: [1, scale, 1, scale * 0.96, 1, 1], opacity: [1, 0.7, 1, 0.8, 1, 1] }}
          transition={{
            duration: sec,
            times: [0, 0.18, 0.36, 0.54, 0.7, 1],
            repeat: Infinity,
            ease: ease(config.easing),
          }}
        >
          {children}
        </motion.div>
      );
    }
    case 'breathe': {
      const scaleHi = 1 + 0.15 * amp;
      const scaleLo = 1 - 0.08 * amp;
      return (
        <motion.div
          style={wrapper}
          animate={{ scale: [scaleLo, scaleHi, scaleLo], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: sec, repeat: Infinity, ease: ease(config.easing) }}
        >
          {children}
        </motion.div>
      );
    }
    case 'bounce': {
      const lift = -16 * amp;
      return (
        <motion.div
          style={wrapper}
          animate={{ y: [lift, 4 * amp, 0, 0, lift], scaleY: [1, 1, 0.92, 1, 1] }}
          transition={{
            duration: sec,
            times: [0, 0.32, 0.46, 0.6, 1],
            repeat: Infinity,
            ease: ease('spring'),
          }}
        >
          {children}
        </motion.div>
      );
    }
    case 'float': {
      const yA = 4 * amp;
      const xA = 3 * amp;
      return (
        <motion.div
          style={wrapper}
          animate={{ y: [-yA, yA, -yA], x: [xA, -xA, xA] }}
          transition={{ duration: sec, repeat: Infinity, ease: ease(config.easing) }}
        >
          {children}
        </motion.div>
      );
    }
    case 'wobble': {
      const a = 16 * amp;
      return (
        <motion.div
          style={wrapper}
          animate={{ rotate: [0, -a, a * 0.85, -a * 0.55, a * 0.4, 0, 0] }}
          transition={{
            duration: sec,
            times: [0, 0.12, 0.28, 0.42, 0.55, 0.7, 1],
            repeat: Infinity,
            ease: ease('spring'),
          }}
        >
          {children}
        </motion.div>
      );
    }
    case 'flip':
      return (
        <div style={{ ...wrapper, perspective: 600 }}>
          <motion.div
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: [0, 180, 180, 360, 360] }}
            transition={{
              duration: sec,
              times: [0, 0.35, 0.5, 0.85, 1],
              repeat: Infinity,
              ease: ease(config.easing),
            }}
          >
            {children}
          </motion.div>
        </div>
      );
    case 'zoom': {
      const hi = 1 + 0.6 * amp;
      const lo = Math.max(0.05, 1 - 0.8 * amp);
      return (
        <motion.div
          style={wrapper}
          animate={{ scale: [lo, 1, 1, hi, lo], opacity: [0, 1, 1, 0, 0] }}
          transition={{
            duration: sec,
            times: [0, 0.35, 0.65, 0.9, 1],
            repeat: Infinity,
            ease: ease(config.easing),
          }}
        >
          {children}
        </motion.div>
      );
    }
  }
}

// ─── Circle element with draw animations ─────────────────────────────────────
function CircleElement({
  circle,
  draw,
}: {
  circle: LoaderConfig['circle'];
  draw: LoaderConfig['draw'];
}) {
  const props = {
    cx: CIRCLE_CX,
    cy: CIRCLE_CY,
    r: CIRCLE_R,
    stroke: circle.color,
    strokeWidth: circle.strokeWidth,
    strokeLinecap: 'round' as const,
    fill: 'none' as const,
    opacity: circle.opacity,
  };

  const drawDur = draw.durationMs / 1000;
  const holdDur = draw.holdMs / 1000;
  const eraseDur = draw.eraseMs / 1000;
  const stagger = draw.staggerMs / 1000;

  if (draw.type === 'arc-orbit') {
    // Rendered as overlay instead — skip here
    return null;
  }

  if (draw.type === 'trace-circle' || draw.type === 'trace-both') {
    // Leads: 0 → draw → hold(+stagger if both) → erase
    const extraHold = draw.type === 'trace-both' ? stagger : 0;
    const total = drawDur + holdDur + extraHold + eraseDur;
    const times = [
      0,
      drawDur / total,
      (drawDur + holdDur + extraHold) / total,
      1,
    ];
    const start = draw.reverse ? -CIRCLE_LEN : CIRCLE_LEN;
    const values = [start, 0, 0, start];
    return (
      <motion.circle
        {...props}
        strokeDasharray={CIRCLE_LEN}
        animate={{ strokeDashoffset: values }}
        transition={{ duration: total, times, repeat: Infinity, ease: ease(draw.easing) }}
      />
    );
  }

  if (draw.type === 'dash-flow-circle') {
    return (
      <motion.circle
        {...props}
        strokeDasharray={`${CIRCLE_LEN * 0.18}, ${CIRCLE_LEN * 0.12}`}
        animate={{ strokeDashoffset: [0, draw.reverse ? CIRCLE_LEN : -CIRCLE_LEN] }}
        transition={{ duration: drawDur, repeat: Infinity, ease: 'linear' }}
      />
    );
  }

  return <circle {...props} />;
}

// ─── Line element with draw animations ───────────────────────────────────────
function LineElement({
  line,
  draw,
}: {
  line: LoaderConfig['line'];
  draw: LoaderConfig['draw'];
}) {
  const props = {
    d: LINE_D,
    stroke: line.color,
    strokeWidth: line.strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
    opacity: line.opacity,
  };

  const drawDur = draw.durationMs / 1000;
  const holdDur = draw.holdMs / 1000;
  const eraseDur = draw.eraseMs / 1000;
  const stagger = draw.staggerMs / 1000;

  if (draw.type === 'trace-line' || draw.type === 'trace-both') {
    // Trails by stagger
    const total = drawDur + holdDur + stagger + eraseDur;
    const lTimes = [
      0,
      stagger / total,
      (stagger + drawDur) / total,
      (stagger + drawDur + holdDur) / total,
      1,
    ];
    const start = draw.reverse ? -LINE_LEN : LINE_LEN;
    const lValues = [start, start, 0, 0, start];
    return (
      <motion.path
        {...props}
        strokeDasharray={LINE_LEN}
        animate={{ strokeDashoffset: lValues }}
        transition={{ duration: total, times: lTimes, repeat: Infinity, ease: ease(draw.easing) }}
      />
    );
  }

  if (draw.type === 'dash-flow-line') {
    return (
      <motion.path
        {...props}
        strokeDasharray={`${LINE_LEN * 0.12}, ${LINE_LEN * 0.08}`}
        animate={{ strokeDashoffset: [0, draw.reverse ? LINE_LEN : -LINE_LEN] }}
        transition={{ duration: drawDur, repeat: Infinity, ease: 'linear' }}
      />
    );
  }

  return <path {...props} />;
}

// ─── Arc orbit overlay (counter-rotating arc on circle) ──────────────────────
function ArcOrbitOverlay({
  size,
  circle,
  draw,
}: {
  size: number;
  circle: LoaderConfig['circle'];
  draw: LoaderConfig['draw'];
}) {
  return (
    <motion.div
      style={{ position: 'absolute', inset: 0, transformOrigin: 'center' }}
      animate={{ rotate: draw.reverse ? -360 : 360 }}
      transition={{ duration: draw.durationMs / 1000, repeat: Infinity, ease: 'linear' }}
    >
      <svg width={size} height={size} viewBox={VIEWBOX} fill="none">
        <circle
          cx={CIRCLE_CX}
          cy={CIRCLE_CY}
          r={CIRCLE_R}
          stroke={circle.color}
          strokeWidth={circle.strokeWidth}
          strokeLinecap="round"
          fill="none"
          opacity={circle.opacity}
          strokeDasharray={`${CIRCLE_LEN * 0.25}, ${CIRCLE_LEN * 0.75}`}
        />
      </svg>
    </motion.div>
  );
}

// ─── Fill (chart area) layer ─────────────────────────────────────────────────
function FillLayer({
  area,
  fill,
}: {
  area: LoaderConfig['area'];
  fill: LoaderConfig['fill'];
}) {
  const sec = fill.durationMs / 1000;
  const base = {
    d: AREA_D,
    fill: area.color,
  };

  if (fill.type === 'none') {
    return <path {...base} opacity={area.opacity} />;
  }

  if (fill.type === 'fade') {
    return (
      <motion.path
        {...base}
        animate={{ opacity: [0, area.opacity, area.opacity, 0] }}
        transition={{ duration: sec, times: [0, 0.3, 0.7, 1], repeat: Infinity, ease: ease(fill.easing) }}
      />
    );
  }

  if (fill.type === 'pulse-fill') {
    return (
      <motion.path
        {...base}
        animate={{ opacity: [area.opacity * 0.3, area.opacity, area.opacity * 0.3] }}
        transition={{ duration: sec, repeat: Infinity, ease: ease(fill.easing) }}
      />
    );
  }

  if (fill.type === 'rise') {
    return (
      <motion.path
        {...base}
        opacity={area.opacity}
        animate={{ y: [RAW_VIEWBOX_SIZE, 0, 0, RAW_VIEWBOX_SIZE] }}
        transition={{ duration: sec, times: [0, 0.4, 0.7, 1], repeat: Infinity, ease: ease(fill.easing) }}
      />
    );
  }

  // sweep — uses a motion rect clip
  return (
    <g>
      <defs>
        <clipPath id="composed-sweep-clip">
          <motion.rect
            x={0}
            y={0}
            height={RAW_VIEWBOX_SIZE}
            animate={{ width: [0, RAW_VIEWBOX_SIZE, RAW_VIEWBOX_SIZE, 0] }}
            transition={{
              duration: sec,
              times: [0, 0.4, 0.7, 1],
              repeat: Infinity,
              ease: ease(fill.easing),
            }}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#composed-sweep-clip)">
        <path {...base} opacity={area.opacity} />
      </g>
    </g>
  );
}

// ─── Echo rings ──────────────────────────────────────────────────────────────
function EchoLayer({ size, echo }: { size: number; echo: LoaderConfig['echo'] }) {
  const sec = echo.durationMs / 1000;
  const expand = 14;
  const vbSize = RAW_VIEWBOX_SIZE + 8 + expand * 2;
  const vb = `${-4 - expand} ${-4 - expand} ${vbSize} ${vbSize}`;
  const renderSize = size * (vbSize / (RAW_VIEWBOX_SIZE + 8));

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <svg width={renderSize} height={renderSize} viewBox={vb} fill="none">
        {Array.from({ length: echo.rings }).map((_, i) => (
          <motion.circle
            key={i}
            cx={CIRCLE_CX}
            cy={CIRCLE_CY}
            stroke={echo.color}
            strokeWidth={echo.strokeWidth}
            fill="none"
            animate={{
              r: [CIRCLE_R, echo.maxRadius],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: sec,
              times: [0, 0.18, 1],
              repeat: Infinity,
              ease: ease('pulse'),
              delay: (echo.staggerMs / 1000) * i,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
