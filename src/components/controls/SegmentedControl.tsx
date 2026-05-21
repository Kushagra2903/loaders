import type { Palette } from '../../theme/tokens';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  label?: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  palette: Palette;
}

export function SegmentedControl<T extends string>({ label, value, options, onChange, palette }: Props<T>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && (
        <label
          style={{
            fontSize: 12,
            color: palette.textSecondary,
            letterSpacing: '-0.005em',
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${options.length}, 1fr)`,
          gap: 4,
          padding: 4,
          background: palette.bg,
          borderRadius: 10,
          border: `1px solid ${palette.border}`,
        }}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                padding: '7px 10px',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                color: active ? palette.textPrimary : palette.textMuted,
                background: active ? palette.surfaceElevated : 'transparent',
                borderRadius: 7,
                border: 'none',
                transition: 'background 160ms ease, color 160ms ease',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
