import type { Palette } from '../theme/tokens';

interface Props {
  label: string;
  icon?: string;
  active: boolean;
  palette: Palette;
  onClick: () => void;
  ariaLabel?: string;
}

export function NavButton({ label, icon, active, palette, onClick, ariaLabel }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel ?? label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 999,
        border: `1px solid ${active ? palette.brand : palette.border}`,
        color: active ? '#FFFFFF' : palette.textSecondary,
        fontSize: 11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)',
        background: active ? palette.brand : palette.surface,
        cursor: 'pointer',
        transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease',
      }}
    >
      {icon && (
        <span aria-hidden style={{ fontSize: 13, lineHeight: 1 }}>
          {icon}
        </span>
      )}
      {label}
    </button>
  );
}
