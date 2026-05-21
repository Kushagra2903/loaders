import { useState } from 'react';
import type { LoaderEntry } from '../loaders/types';
import type { Palette } from '../theme/tokens';

interface Props {
  entry: LoaderEntry;
  palette: Palette;
}

export function LoaderCard({ entry, palette }: Props) {
  const { component: Loader, label } = entry;
  const [hovered, setHovered] = useState(false);

  const cardBg = hovered ? palette.brand : palette.surface;
  const labelColor = hovered ? '#FFFFFF' : palette.textPrimary;
  const loaderColor = hovered ? '#FFFFFF' : palette.textPrimary;
  const variantColor = hovered ? 'rgba(255,255,255,0.75)' : palette.textMuted;
  const border = hovered ? 'transparent' : palette.border;
  const shadow = hovered
    ? `0 24px 60px ${hexToRgba(palette.brand, 0.28)}`
    : 'none';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: cardBg,
        borderRadius: 24,
        padding: '28px 24px 22px',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${border}`,
        boxShadow: shadow,
        transition: 'background 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 160,
        }}
      >
        <Loader size={140} color={loaderColor} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 500,
            color: labelColor,
            letterSpacing: '-0.005em',
          }}
        >
          {label}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 10,
            color: variantColor,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {entry.variant}
        </p>
      </div>
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
