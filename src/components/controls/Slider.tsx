import type { Palette } from '../../theme/tokens';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (v: number) => string;
  onChange: (value: number) => void;
  palette: Palette;
}

export function Slider({ label, value, min, max, step = 1, unit, formatValue, onChange, palette }: Props) {
  const display = formatValue ? formatValue(value) : `${value}${unit ?? ''}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
            fontSize: 11,
            color: palette.textPrimary,
            fontFamily: 'var(--font-mono)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: palette.brand,
          cursor: 'pointer',
        }}
      />
    </div>
  );
}
