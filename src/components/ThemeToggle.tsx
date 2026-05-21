import type { Palette, ThemeMode } from '../theme/tokens';

interface Props {
  mode: ThemeMode;
  palette: Palette;
  onToggle: () => void;
}

export function ThemeToggle({ mode, palette, onToggle }: Props) {
  const isDark = mode === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 999,
        border: `1px solid ${palette.border}`,
        color: palette.textSecondary,
        fontSize: 11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)',
        background: palette.surface,
        transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease',
      }}
    >
      <span aria-hidden style={{ fontSize: 14, lineHeight: 1 }}>
        {isDark ? '○' : '●'}
      </span>
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}
