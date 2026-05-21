export type EasingKey = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'draw' | 'pulse' | 'spring';

export type TransformType =
  | 'none'
  | 'rotate'
  | 'pulse'
  | 'breathe'
  | 'bounce'
  | 'float'
  | 'wobble'
  | 'flip'
  | 'zoom';

export type DrawType =
  | 'none'
  | 'trace-circle'
  | 'trace-line'
  | 'trace-both'
  | 'dash-flow-line'
  | 'dash-flow-circle'
  | 'arc-orbit';

export type FillType = 'none' | 'fade' | 'rise' | 'sweep' | 'pulse-fill';

export interface ElementStyle {
  visible: boolean;
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface AreaStyle {
  visible: boolean;
  color: string;
  opacity: number;
}

export interface TransformConfig {
  type: TransformType;
  durationMs: number;
  easing: EasingKey;
  amplitude: number;
  reverse: boolean;
}

export interface DrawConfig {
  type: DrawType;
  durationMs: number;
  easing: EasingKey;
  holdMs: number;
  eraseMs: number;
  reverse: boolean;
  staggerMs: number;
}

export interface FillConfig {
  type: FillType;
  durationMs: number;
  easing: EasingKey;
}

export interface EchoConfig {
  enabled: boolean;
  durationMs: number;
  color: string;
  maxRadius: number;
  strokeWidth: number;
  staggerMs: number;
  rings: number;
}

export interface GlowConfig {
  enabled: boolean;
  intensity: number;
  color: string;
}

export interface LoaderConfig {
  circle: ElementStyle;
  line: ElementStyle;
  area: AreaStyle;
  transform: TransformConfig;
  draw: DrawConfig;
  fill: FillConfig;
  echo: EchoConfig;
  glow: GlowConfig;
}

export const EASING_VALUES: Record<EasingKey, string | number[]> = {
  linear: 'linear',
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  draw: [0.32, 0.72, 0, 1],
  pulse: [0.45, 0, 0.55, 1],
  spring: [0.34, 1.56, 0.64, 1],
};

export const EASING_OPTIONS: { value: EasingKey; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'easeIn', label: 'In' },
  { value: 'easeOut', label: 'Out' },
  { value: 'easeInOut', label: 'InOut' },
  { value: 'draw', label: 'Draw' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'spring', label: 'Spring' },
];

export const TRANSFORM_OPTIONS: { value: TransformType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'rotate', label: 'Rotate' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'breathe', label: 'Breathe' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'float', label: 'Float' },
  { value: 'wobble', label: 'Wobble' },
  { value: 'flip', label: 'Flip' },
  { value: 'zoom', label: 'Zoom' },
];

export const DRAW_OPTIONS: { value: DrawType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'trace-circle', label: 'Trace circle' },
  { value: 'trace-line', label: 'Trace line' },
  { value: 'trace-both', label: 'Trace both' },
  { value: 'dash-flow-line', label: 'Dash flow · line' },
  { value: 'dash-flow-circle', label: 'Dash flow · circle' },
  { value: 'arc-orbit', label: 'Arc orbit' },
];

export const FILL_OPTIONS: { value: FillType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade' },
  { value: 'rise', label: 'Rise' },
  { value: 'sweep', label: 'Sweep' },
  { value: 'pulse-fill', label: 'Pulse' },
];

export function defaultConfig(textColor: string, brand: string): LoaderConfig {
  return {
    circle: { visible: true, color: textColor, strokeWidth: 1.0, opacity: 1 },
    line: { visible: true, color: textColor, strokeWidth: 1.0, opacity: 1 },
    area: { visible: false, color: brand, opacity: 0.22 },
    transform: { type: 'none', durationMs: 2000, easing: 'pulse', amplitude: 50, reverse: false },
    draw: {
      type: 'trace-both',
      durationMs: 1400,
      easing: 'draw',
      holdMs: 400,
      eraseMs: 700,
      reverse: false,
      staggerMs: 220,
    },
    fill: { type: 'none', durationMs: 2400, easing: 'pulse' },
    echo: {
      enabled: false,
      durationMs: 1800,
      color: textColor,
      maxRadius: 26,
      strokeWidth: 0.8,
      staggerMs: 600,
      rings: 1,
    },
    glow: { enabled: false, intensity: 50, color: brand },
  };
}

export interface Preset {
  id: string;
  label: string;
  build: (textColor: string, brand: string) => LoaderConfig;
}

export const PRESETS: Preset[] = [
  {
    id: 'blank',
    label: 'Blank · static logo',
    build: (t, b) => ({
      ...defaultConfig(t, b),
      draw: { ...defaultConfig(t, b).draw, type: 'none' },
    }),
  },
  {
    id: 'trace',
    label: 'Trace draw',
    build: (t, b) => defaultConfig(t, b),
  },
  {
    id: 'arc-orbit',
    label: 'Arc orbit · spinner',
    build: (t, b) => ({
      ...defaultConfig(t, b),
      draw: { ...defaultConfig(t, b).draw, type: 'arc-orbit', durationMs: 1200, easing: 'linear' },
    }),
  },
  {
    id: 'pulse',
    label: 'Pulse heartbeat',
    build: (t, b) => ({
      ...defaultConfig(t, b),
      draw: { ...defaultConfig(t, b).draw, type: 'none' },
      transform: {
        type: 'pulse',
        durationMs: 1400,
        easing: 'pulse',
        amplitude: 60,
        reverse: false,
      },
    }),
  },
  {
    id: 'fill-rise',
    label: 'Fill · rising tide',
    build: (t, b) => ({
      ...defaultConfig(t, b),
      area: { visible: true, color: b, opacity: 0.28 },
      draw: { ...defaultConfig(t, b).draw, type: 'none' },
      fill: { type: 'rise', durationMs: 2600, easing: 'pulse' },
    }),
  },
  {
    id: 'echo',
    label: 'Echo ripples',
    build: (t, b) => ({
      ...defaultConfig(t, b),
      draw: { ...defaultConfig(t, b).draw, type: 'none' },
      echo: {
        enabled: true,
        durationMs: 1800,
        color: t,
        maxRadius: 28,
        strokeWidth: 0.8,
        staggerMs: 600,
        rings: 2,
      },
    }),
  },
  {
    id: 'breathe-glow',
    label: 'Breathe + glow',
    build: (t, b) => ({
      ...defaultConfig(t, b),
      draw: { ...defaultConfig(t, b).draw, type: 'none' },
      transform: {
        type: 'breathe',
        durationMs: 2800,
        easing: 'pulse',
        amplitude: 40,
        reverse: false,
      },
      glow: { enabled: true, intensity: 60, color: b },
    }),
  },
];
