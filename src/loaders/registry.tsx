import { BrandedLogoLoader, type LoaderVariant } from './BrandedLogoLoader';
import { ChartFillLoader, type ChartVariant } from './ChartFillLoader';
import type { LoaderEntry } from './types';

const BRANDED: Array<{ variant: LoaderVariant; cycleMs: number }> = [
  { variant: 'trace', cycleMs: 2470 },
  { variant: 'pulse', cycleMs: 1780 },
  { variant: 'orbit', cycleMs: 1100 },
  { variant: 'orbit-flow', cycleMs: 4200 },
  { variant: 'dual-orbit', cycleMs: 1300 },
  { variant: 'sync-orbit', cycleMs: 1500 },
  { variant: 'assemble', cycleMs: 5300 },
  { variant: 'sync-assemble', cycleMs: 4500 },
  { variant: 'echo', cycleMs: 1800 },
  { variant: 'echo-pulse', cycleMs: 1800 },
  { variant: 'bounce', cycleMs: 2000 },
  { variant: 'float', cycleMs: 2200 },
  { variant: 'breathe', cycleMs: 2800 },
  { variant: 'zoom-in', cycleMs: 2400 },
  { variant: 'zoom-out', cycleMs: 2400 },
  { variant: 'stagger-trace', cycleMs: 2100 },
];

const CHART: Array<{ variant: ChartVariant; cycleMs: number }> = [
  { variant: 'fill', cycleMs: 3100 },
  { variant: 'rise', cycleMs: 2800 },
  { variant: 'sweep', cycleMs: 2600 },
  { variant: 'trace-fill', cycleMs: 2800 },
  { variant: 'bars', cycleMs: 2620 },
  { variant: 'scan-bar', cycleMs: 2000 },
  { variant: 'scan-bar-bounce', cycleMs: 3050 },
  { variant: 'ripple', cycleMs: 1700 },
  { variant: 'bloom', cycleMs: 2500 },
  { variant: 'stagger-fill', cycleMs: 2960 },
  { variant: 'drip', cycleMs: 3300 },
  { variant: 'heartbeat', cycleMs: 2800 },
];

function labelize(variant: string): string {
  return variant
    .split('-')
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(' ');
}

export const LOADERS: LoaderEntry[] = [
  ...BRANDED.map<LoaderEntry>((b) => ({
    id: `branded-${b.variant}`,
    family: 'branded',
    variant: b.variant,
    label: labelize(b.variant),
    cycleMs: b.cycleMs,
    component: ({ size, color }) => (
      <BrandedLogoLoader size={size} color={color} variant={b.variant} />
    ),
  })),
  ...CHART.map<LoaderEntry>((c) => ({
    id: `chart-${c.variant}`,
    family: 'chart',
    variant: c.variant,
    label: `Chart · ${labelize(c.variant)}`,
    cycleMs: c.cycleMs,
    component: ({ size, color }) => (
      <ChartFillLoader size={size} color={color} variant={c.variant} />
    ),
  })),
];
