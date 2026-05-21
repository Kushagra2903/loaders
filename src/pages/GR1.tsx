import { useState } from 'react';
import { Gr1AssembleLoader } from '../gr1/Gr1AssembleLoader';
import { Gr1BloomLoader } from '../gr1/Gr1BloomLoader';
import { Gr1CascadeLoader } from '../gr1/Gr1CascadeLoader';
import { Gr1ConvolveLoader } from '../gr1/Gr1ConvolveLoader';
import { Gr1DriftLoader } from '../gr1/Gr1DriftLoader';
import { Gr1GrowLoader } from '../gr1/Gr1GrowLoader';
import { Gr1InertiaLoader } from '../gr1/Gr1InertiaLoader';
import { Gr1MorphLoader } from '../gr1/Gr1MorphLoader';
import { Gr1OrbitLoader } from '../gr1/Gr1OrbitLoader';
import { Gr1PulseLoader } from '../gr1/Gr1PulseLoader';
import { Gr1ResonateLoader } from '../gr1/Gr1ResonateLoader';
import { Gr1SequenceLoader } from '../gr1/Gr1SequenceLoader';
import { Gr1SettleLoader } from '../gr1/Gr1SettleLoader';
import { Gr1SpinLoader } from '../gr1/Gr1SpinLoader';
import { Gr1ThinkingLoader } from '../gr1/Gr1ThinkingLoader';
import { Gr1TraceLoader } from '../gr1/Gr1TraceLoader';
import type { Palette } from '../theme/tokens';

interface Props {
  palette: Palette;
}

interface StateCard {
  id: string;
  label: string;
  render: (color: string) => React.ReactNode;
}

interface StateCategory {
  id: string;
  label: string;
  caption: string;
  cards: StateCard[];
}

export function GR1({ palette: p }: Props) {
  const categories: StateCategory[] = [
    {
      id: 'thinking',
      label: 'Thinking',
      caption: 'Ambient, low-intensity — GR-1 is listening or holding attention.',
      cards: [
        { id: 'drift', label: 'Drift', render: (c) => <Gr1DriftLoader size={140} color={c} /> },
        { id: 'trace', label: 'Trace', render: (c) => <Gr1TraceLoader size={140} color={c} /> },
      ],
    },
    {
      id: 'deep-thinking',
      label: 'Deep Thinking',
      caption: 'Layered, sustained motion — GR-1 is reasoning through something.',
      cards: [
        { id: 'cascade', label: 'Cascade', render: (c) => <Gr1CascadeLoader size={140} color={c} /> },
        { id: 'convolve', label: 'Convolve', render: (c) => <Gr1ConvolveLoader size={140} color={c} /> },
        { id: 'resonate', label: 'Resonate', render: (c) => <Gr1ResonateLoader size={140} color={c} /> },
        { id: 'orbit', label: 'Orbit', render: (c) => <Gr1OrbitLoader size={140} color={c} /> },
        { id: 'inertia', label: 'Inertia', render: (c) => <Gr1InertiaLoader size={140} color={c} /> },
        { id: 'spin', label: 'Spin', render: (c) => <Gr1SpinLoader size={140} color={c} /> },
      ],
    },
    {
      id: 'result',
      label: 'Result',
      caption: 'Decisive arrival — the answer is landing.',
      cards: [
        { id: 'bloom', label: 'Bloom', render: (c) => <Gr1BloomLoader size={140} color={c} /> },
        { id: 'settle', label: 'Settle', render: (c) => <Gr1SettleLoader size={140} color={c} /> },
      ],
    },
    {
      id: 'effects',
      label: 'Effects',
      caption: 'Motion explorations on the GR-1 mark.',
      cards: [
        { id: 'thinking-effect', label: 'Thinking', render: (c) => <Gr1ThinkingLoader size={140} color={c} /> },
        { id: 'pulse-effect', label: 'Pulse', render: (c) => <Gr1PulseLoader size={140} color={c} /> },
        { id: 'assemble-effect', label: 'Assemble', render: (c) => <Gr1AssembleLoader size={140} color={c} /> },
        { id: 'sequence-effect', label: 'Sequence', render: (c) => <Gr1SequenceLoader size={140} color={c} /> },
        { id: 'morph-effect', label: 'Morph', render: (c) => <Gr1MorphLoader size={140} color={c} /> },
        { id: 'grow-effect', label: 'Grow', render: (c) => <Gr1GrowLoader size={140} color={c} /> },
      ],
    },
  ];

  const totalCount = categories.reduce((n, cat) => n + cat.cards.length, 0);

  return (
    <section style={{ maxWidth: 1400, marginInline: 'auto' }}>
      <div style={{ marginBottom: 40 }}>
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
          GR-1 · {totalCount}
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
          Assistant states
        </h2>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: 13,
            color: p.textSecondary,
            maxWidth: 480,
          }}
        >
          Loading and conversational states for GR-1 — Groww&apos;s in-app AI assistant.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {categories.map((cat) => (
          <CategorySection key={cat.id} category={cat} palette={p} />
        ))}
      </div>
    </section>
  );
}

interface CategoryProps {
  category: StateCategory;
  palette: Palette;
}

function CategorySection({ category, palette: p }: CategoryProps) {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: p.textMuted,
            fontFamily: 'var(--font-mono)',
            marginBottom: 6,
          }}
        >
          {category.label} · {category.cards.length}
        </div>
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 500,
            color: p.textPrimary,
            letterSpacing: '-0.01em',
          }}
        >
          {category.label}
        </h3>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 12,
            color: p.textSecondary,
            maxWidth: 480,
          }}
        >
          {category.caption}
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {category.cards.map((s) => (
          <Gr1Card key={s.id} card={s} palette={p} />
        ))}
      </div>
    </div>
  );
}

interface CardProps {
  card: StateCard;
  palette: Palette;
}

function Gr1Card({ card, palette }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const cardBg = hovered ? palette.brand : palette.surface;
  const labelColor = hovered ? '#FFFFFF' : palette.textPrimary;
  const loaderColor = hovered ? '#FFFFFF' : palette.textPrimary;
  const border = hovered ? 'transparent' : palette.border;
  const shadow = hovered ? `0 24px 60px ${hexToRgba(palette.brand, 0.28)}` : 'none';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: cardBg,
        borderRadius: 24,
        padding: '28px 24px 22px',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${border}`,
        boxShadow: shadow,
        transition: 'background 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 160,
        }}
      >
        {card.render(loaderColor)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 500,
            color: labelColor,
            letterSpacing: '-0.005em',
          }}
        >
          {card.label}
        </h3>
      </div>
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
