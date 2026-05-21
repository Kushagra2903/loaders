import type { Palette } from '../../theme/tokens';
import type { LoaderEntry } from '../../loaders/types';

interface Props {
  loaders: LoaderEntry[];
  value: string;
  onChange: (id: string) => void;
  palette: Palette;
}

export function LoaderSelect({ loaders, value, onChange, palette }: Props) {
  const branded = loaders.filter((l) => l.family === 'branded');
  const chart = loaders.filter((l) => l.family === 'chart');

  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          appearance: 'none',
          WebkitAppearance: 'none',
          padding: '10px 36px 10px 14px',
          background: palette.surface,
          color: palette.textPrimary,
          border: `1px solid ${palette.border}`,
          borderRadius: 10,
          fontSize: 13,
          fontFamily: 'inherit',
          cursor: 'pointer',
          outline: 'none',
          letterSpacing: '-0.005em',
        }}
      >
        <optgroup label="Branded">
          {branded.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Chart">
          {chart.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </optgroup>
      </select>
      <span
        aria-hidden
        style={{
          position: 'absolute',
          right: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: palette.textMuted,
          fontSize: 10,
          pointerEvents: 'none',
        }}
      >
        ▾
      </span>
    </div>
  );
}
