import type { ComponentType } from 'react';

export interface LoaderProps {
  size?: number;
  color?: string;
}

export type LoaderFamily = 'branded' | 'chart';

export interface LoaderEntry {
  id: string;
  family: LoaderFamily;
  variant: string;
  label: string;
  cycleMs: number;
  component: ComponentType<{ size?: number; color?: string }>;
}
