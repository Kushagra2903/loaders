import { useState } from 'react';
import type { LoaderEntry } from '../loaders/types';
import type { Palette } from '../theme/tokens';
import brandedSrc from '../loaders/BrandedLogoLoader.tsx?raw';
import chartSrc from '../loaders/ChartFillLoader.tsx?raw';

interface Props {
  entry: LoaderEntry;
  palette: Palette;
}

function usageSnippet(entry: LoaderEntry): string {
  const name = entry.family === 'branded' ? 'BrandedLogoLoader' : 'ChartFillLoader';
  const file = entry.family === 'branded' ? 'BrandedLogoLoader' : 'ChartFillLoader';
  return `import { ${name} } from './${file}';\n\n<${name} variant="${entry.variant}" size={96} color="#1EB75B" />`;
}

export function LoaderCard({ entry, palette }: Props) {
  const { component: Loader, label } = entry;
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState<'usage' | 'source' | null>(null);

  const cardBg = hovered ? palette.brand : palette.surface;
  const labelColor = hovered ? '#FFFFFF' : palette.textPrimary;
  const loaderColor = hovered ? '#FFFFFF' : palette.textPrimary;
  const variantColor = hovered ? 'rgba(255,255,255,0.75)' : palette.textMuted;
  const border = hovered ? 'transparent' : palette.border;
  const shadow = hovered
    ? `0 24px 60px ${hexToRgba(palette.brand, 0.28)}`
    : 'none';

  function copy(type: 'usage' | 'source', e: React.MouseEvent) {
    e.stopPropagation();
    const text = type === 'usage'
      ? usageSnippet(entry)
      : (entry.family === 'branded' ? brandedSrc : chartSrc);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 1600);
    });
  }

  const btnStyle: React.CSSProperties = {
    padding: '4px 10px',
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 6,
    background: 'rgba(255,255,255,0.1)',
    color: '#FFFFFF',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background 120ms ease',
  };

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
        cursor: 'default',
      }}
    >
      {/* Copy buttons — fade in on hover */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          display: 'flex',
          gap: 6,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 150ms ease',
          pointerEvents: hovered ? 'auto' : 'none',
        }}
      >
        <button style={btnStyle} onClick={(e) => copy('usage', e)}>
          {copied === 'usage' ? '✓ copied' : 'Usage'}
        </button>
        <button style={btnStyle} onClick={(e) => copy('source', e)}>
          {copied === 'source' ? '✓ copied' : 'Source'}
        </button>
      </div>

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
