export type ThemeMode = 'dark' | 'light';

export interface Palette {
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  brand: string;
  brandSoft: string;
  accentGreen: string;
  accentRed: string;
}

// Mint Design System · Groww Invest (v0.19)
// Accent hue = green (#04B488). Tokens resolved from `/Resources/mint-ds-groww-invest-v0.19.md`.
export const palette: Record<ThemeMode, Palette> = {
  light: {
    bg: '#FFFFFF',              // backgroundPrimary  · new-neutrals/light/1
    surface: '#FFFFFF',         // backgroundSurfaceZ1 · new-neutrals/light/1
    surfaceElevated: '#FFFFFF', // backgroundSurfaceZ2 · new-neutrals/light/1
    border: '#E7E8E9',          // borderPrimary       · new-neutrals/light/4
    textPrimary: '#353839',     // contentPrimary      · new-neutrals/light/12
    textSecondary: '#7F8283',   // contentSecondary    · new-neutrals/light/10
    textMuted: '#898C8E',       // contentTertiary     · new-neutrals/light/9
    brand: '#04B488',           // accentBase          · hues/green/light/09
    brandSoft: '#E9FAF3',       // accentSubtle        · hues/green/light/02
    accentGreen: '#04B488',     // positiveBase        · hues/green/light/09
    accentRed: '#ED5533',       // negativeBase        · hues/red/light/09
  },
  dark: {
    bg: '#060809',              // backgroundPrimary  · new-neutrals/dark/1
    surface: '#151819',         // backgroundSurfaceZ1 · new-neutrals/dark/2
    surfaceElevated: '#1E2224', // backgroundSurfaceZ2 · new-neutrals/dark/3
    border: '#252A2C',          // borderPrimary       · new-neutrals/dark/4
    textPrimary: '#F2F5F7',     // contentPrimary      · new-neutrals/dark/12
    textSecondary: '#989EA0',   // contentSecondary    · new-neutrals/dark/10
    textMuted: '#696E70',       // contentTertiary     · new-neutrals/dark/9
    brand: '#04B488',           // accentBase          · hues/green/dark/09
    brandSoft: '#0F251D',       // accentSubtle        · hues/green/dark/02
    accentGreen: '#04B488',     // positiveBase        · hues/green/dark/09
    accentRed: '#FF5E3B',       // negativeBase        · hues/red/dark/09
  },
};
