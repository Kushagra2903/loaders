import type { Palette } from '../../theme/tokens';

interface Props {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  palette: Palette;
}

export function Toggle({ label, value, onChange, palette }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <label
        style={{
          fontSize: 12,
          color: palette.textSecondary,
          letterSpacing: '-0.005em',
        }}
      >
        {label}
      </label>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        style={{
          position: 'relative',
          width: 36,
          height: 20,
          borderRadius: 999,
          background: value ? palette.brand : palette.border,
          border: 'none',
          padding: 0,
          transition: 'background 200ms ease',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: value ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#FFFFFF',
            transition: 'left 200ms ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        />
      </button>
    </div>
  );
}
