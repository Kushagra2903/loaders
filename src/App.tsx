import { useEffect, useMemo, useState } from 'react';
import { LoaderCard } from './components/LoaderCard';
import { NavButton } from './components/NavButton';
import { ThemeToggle } from './components/ThemeToggle';
import { LOADERS } from './loaders/registry';
import { GR1 } from './pages/GR1';
import { Playground } from './pages/Playground';
import { palette, type Palette, type ThemeMode } from './theme/tokens';

const STORAGE_KEY = 'groww-loaders.theme';

type View = 'gallery' | 'playground' | 'gr1';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

export function App() {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);
  const [view, setView] = useState<View>('gallery');
  const p = palette[mode];

  useEffect(() => {
    document.documentElement.style.setProperty('--bg', p.bg);
    document.documentElement.style.setProperty('--text-primary', p.textPrimary);
    document.body.style.background = p.bg;
    document.body.style.color = p.textPrimary;
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, p]);

  const branded = useMemo(() => LOADERS.filter((l) => l.family === 'branded'), []);
  const chart = useMemo(() => LOADERS.filter((l) => l.family === 'chart'), []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: p.bg,
        color: p.textPrimary,
        padding: '64px clamp(20px, 5vw, 56px) 96px',
        transition: 'background 240ms ease, color 240ms ease',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
          marginBottom: 64,
          maxWidth: 1400,
          marginInline: 'auto',
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: p.textMuted,
              fontFamily: 'var(--font-mono)',
              marginBottom: 16,
            }}
          >
            Motion Lab · Phase 01
            {view === 'playground' && ' · Playground'}
            {view === 'gr1' && ' · GR-1'}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 500,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              color: p.textPrimary,
            }}
          >
            {view === 'playground'
              ? 'Tune any loader'
              : view === 'gr1'
                ? 'GR-1'
                : 'Loaders for Groww'}
          </h1>
          <p
            style={{
              marginTop: 20,
              marginBottom: 0,
              maxWidth: 560,
              fontSize: 15,
              lineHeight: 1.6,
              color: p.textSecondary,
            }}
          >
            {view === 'playground'
              ? 'Pick any loader, scale it, change its color, drop it on different surfaces. Built to validate how each animation reads on real product backgrounds.'
              : view === 'gr1'
                ? 'Dedicated workspace for the GR-1 explorations. Specs incoming.'
                : `A library of ${LOADERS.length} custom loading animations built around the Groww logo — split between branded-logo motion and chart-area fills. Web prototype, headed to React Native + Expo.`}
          </p>
        </div>
        <div style={{ display: 'inline-flex', gap: 10, flexWrap: 'wrap' }}>
          <NavButton
            label="Groww"
            icon="◉"
            active={view === 'gallery'}
            palette={p}
            onClick={() => setView('gallery')}
            ariaLabel="Groww logo loaders"
          />
          <NavButton
            label="Playground"
            icon="◐"
            active={view === 'playground'}
            palette={p}
            onClick={() => setView('playground')}
            ariaLabel="Open playground"
          />
          <NavButton
            label="GR-1"
            icon="◇"
            active={view === 'gr1'}
            palette={p}
            onClick={() => setView('gr1')}
            ariaLabel="Open GR-1"
          />
          <ThemeToggle mode={mode} palette={p} onToggle={() => setMode(mode === 'dark' ? 'light' : 'dark')} />
        </div>
      </header>

      {view === 'gallery' ? (
        <>
          <Section
            eyebrow={`Branded · ${branded.length}`}
            title="Logo animations"
            description="The Groww mark itself — tracing, orbiting, assembling, breathing."
            palette={p}
            loaders={branded}
          />

          <div style={{ height: 64 }} />

          <Section
            eyebrow={`Chart · ${chart.length}`}
            title="Chart fills"
            description="The chart-area beneath the logo line — filling, rising, scanning, rippling."
            palette={p}
            loaders={chart}
          />
        </>
      ) : view === 'playground' ? (
        <Playground palette={p} />
      ) : (
        <GR1 palette={p} />
      )}

      <footer
        style={{
          maxWidth: 1400,
          marginInline: 'auto',
          marginTop: 80,
          paddingTop: 24,
          borderTop: `1px solid ${p.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: p.textMuted,
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span>{LOADERS.length} loaders</span>
        <span>Groww · Kushagra</span>
      </footer>
    </div>
  );
}

interface SectionProps {
  eyebrow: string;
  title: string;
  description: string;
  palette: Palette;
  loaders: typeof LOADERS;
}

function Section({ eyebrow, title, description, palette: p, loaders }: SectionProps) {
  return (
    <section style={{ maxWidth: 1400, marginInline: 'auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: p.textMuted,
            fontFamily: 'var(--font-mono)',
            marginBottom: 10,
          }}
        >
          {eyebrow}
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 500,
            color: p.textPrimary,
            letterSpacing: '-0.015em',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: 13,
            color: p.textSecondary,
            maxWidth: 480,
          }}
        >
          {description}
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {loaders.map((entry) => (
          <LoaderCard key={entry.id} entry={entry} palette={p} />
        ))}
      </div>
    </section>
  );
}
