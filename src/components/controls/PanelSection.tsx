import type { ReactNode } from 'react';
import type { Palette } from '../../theme/tokens';

interface Props {
  title: string;
  hint?: string;
  palette: Palette;
  children: ReactNode;
}

export function PanelSection({ title, hint, palette, children }: Props) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        paddingBottom: 20,
        borderBottom: `1px solid ${palette.border}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: palette.textMuted,
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
          }}
        >
          {title}
        </h3>
        {hint && (
          <span
            style={{
              fontSize: 10,
              color: palette.textMuted,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {hint}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
