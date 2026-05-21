import type { Palette } from '../../theme/tokens';

export interface Swatch {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  value: string;
  swatches: Swatch[];
  onChange: (value: string) => void;
  palette: Palette;
  allowCustom?: boolean;
}

export function ColorSwatchPicker({ label, value, swatches, onChange, palette, allowCustom = true }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {label && (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <label
            style={{
              fontSize: 12,
              color: palette.textSecondary,
              letterSpacing: '-0.005em',
            }}
          >
            {label}
          </label>
          <span
            style={{
              fontSize: 10,
              color: palette.textMuted,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {value}
          </span>
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {swatches.map((s) => {
          const active = s.value.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={s.label}
              type="button"
              title={`${s.label} · ${s.value}`}
              onClick={() => onChange(s.value)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: s.value,
                border: active ? `2px solid ${palette.textPrimary}` : `1px solid ${palette.border}`,
                padding: 0,
                cursor: 'pointer',
                boxShadow: active ? `0 0 0 2px ${palette.bg}` : 'none',
                transition: 'transform 140ms ease',
                transform: active ? 'scale(1.08)' : 'scale(1)',
              }}
            />
          );
        })}
        {allowCustom && (
          <label
            style={{
              position: 'relative',
              width: 26,
              height: 26,
              borderRadius: 7,
              border: `1px dashed ${palette.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: palette.textMuted,
              fontSize: 14,
              overflow: 'hidden',
            }}
            title="Custom color"
          >
            <span aria-hidden style={{ pointerEvents: 'none' }}>+</span>
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                border: 'none',
                padding: 0,
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}
