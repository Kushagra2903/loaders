import { useMemo, useState } from 'react';
import type { Palette } from '../theme/tokens';
import { PanelSection } from '../components/controls/PanelSection';
import { Slider } from '../components/controls/Slider';
import { SegmentedControl } from '../components/controls/SegmentedControl';
import { Toggle } from '../components/controls/Toggle';
import { ColorSwatchPicker, type Swatch } from '../components/controls/ColorSwatchPicker';
import { ComposedLoader } from '../playground/ComposedLoader';
import {
  DRAW_OPTIONS,
  EASING_OPTIONS,
  FILL_OPTIONS,
  PRESETS,
  TRANSFORM_OPTIONS,
  defaultConfig,
  type DrawType,
  type EasingKey,
  type FillType,
  type LoaderConfig,
  type TransformType,
} from '../playground/types';

interface Props {
  palette: Palette;
}

type BgMode = 'theme' | 'surface' | 'custom' | 'transparent';
type StageShape = 'square' | 'circle' | 'phone';

export function Playground({ palette }: Props) {
  const [config, setConfig] = useState<LoaderConfig>(() => defaultConfig(palette.textPrimary, palette.brand));
  const [size, setSize] = useState(220);
  const [bgMode, setBgMode] = useState<BgMode>('surface');
  const [customBg, setCustomBg] = useState(palette.surfaceElevated);
  const [stageShape, setStageShape] = useState<StageShape>('square');
  const [stagePadding, setStagePadding] = useState(48);
  const [stageRadius, setStageRadius] = useState(24);
  const [showBorder, setShowBorder] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showBbox, setShowBbox] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const [copied, setCopied] = useState(false);

  function patch<K extends keyof LoaderConfig>(key: K, value: Partial<LoaderConfig[K]>) {
    setConfig((c) => ({ ...c, [key]: { ...(c[key] as object), ...value } } as LoaderConfig));
  }

  function applyPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setConfig(preset.build(palette.textPrimary, palette.brand));
    setRestartKey((k) => k + 1);
  }

  function reset() {
    setConfig(defaultConfig(palette.textPrimary, palette.brand));
    setRestartKey((k) => k + 1);
  }

  const colorSwatches: Swatch[] = useMemo(
    () => [
      { label: 'Text', value: palette.textPrimary },
      { label: 'Secondary', value: palette.textSecondary },
      { label: 'Brand', value: palette.brand },
      { label: 'Brand soft', value: palette.brandSoft },
      { label: 'Green', value: palette.accentGreen },
      { label: 'Red', value: palette.accentRed },
      { label: 'White', value: '#FFFFFF' },
      { label: 'Black', value: '#0E0E0F' },
    ],
    [palette],
  );

  const bgSwatches: Swatch[] = useMemo(
    () => [
      { label: 'BG', value: palette.bg },
      { label: 'Surface', value: palette.surface },
      { label: 'Surface elevated', value: palette.surfaceElevated },
      { label: 'Brand', value: palette.brand },
      { label: 'White', value: '#FFFFFF' },
      { label: 'Black', value: '#0E0E0F' },
    ],
    [palette],
  );

  function resolveBg() {
    if (bgMode === 'theme') return palette.bg;
    if (bgMode === 'surface') return palette.surface;
    if (bgMode === 'custom') return customBg;
    return 'transparent';
  }

  function copyConfig() {
    const json = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    });
  }

  const transparentChecker =
    bgMode === 'transparent'
      ? `linear-gradient(45deg, ${palette.border} 25%, transparent 25%),
         linear-gradient(-45deg, ${palette.border} 25%, transparent 25%),
         linear-gradient(45deg, transparent 75%, ${palette.border} 75%),
         linear-gradient(-45deg, transparent 75%, ${palette.border} 75%)`
      : undefined;

  function stageAspect() {
    if (stageShape === 'phone') return '9 / 16';
    return '1 / 1';
  }
  function stageBorderRadius() {
    if (stageShape === 'circle') return '50%';
    if (stageShape === 'phone') return '36px';
    return `${stageRadius}px`;
  }

  return (
    <div
      style={{
        maxWidth: 1500,
        marginInline: 'auto',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: 32,
        alignItems: 'start',
      }}
    >
      {/* ─── Stage ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 32 }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: stageAspect(),
            maxHeight: 'calc(100vh - 200px)',
            borderRadius: 28,
            border: `1px solid ${palette.border}`,
            background: palette.bg,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: stageShape === 'phone' ? '70%' : '85%',
              aspectRatio: stageAspect(),
              maxHeight: '85%',
              borderRadius: stageBorderRadius(),
              background: bgMode === 'transparent' ? undefined : resolveBg(),
              backgroundImage: transparentChecker,
              backgroundSize:
                bgMode === 'transparent'
                  ? '20px 20px, 20px 20px, 20px 20px, 20px 20px'
                  : undefined,
              backgroundPosition:
                bgMode === 'transparent'
                  ? '0 0, 0 10px, 10px -10px, -10px 0px'
                  : undefined,
              border: showBorder ? `1px solid ${palette.border}` : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: stagePadding,
              overflow: 'hidden',
              transition: 'border-radius 240ms ease, background 240ms ease',
            }}
          >
            {showGrid && (
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `linear-gradient(${palette.border} 1px, transparent 1px),
                                    linear-gradient(90deg, ${palette.border} 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                  opacity: 0.5,
                  pointerEvents: 'none',
                }}
              />
            )}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {showBbox && (
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    border: `1px dashed ${palette.brand}`,
                    pointerEvents: 'none',
                  }}
                />
              )}
              <ComposedLoader key={restartKey} size={size} config={config} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingInline: 4,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: palette.textMuted,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <span>
            {[
              config.transform.type !== 'none' && config.transform.type,
              config.draw.type !== 'none' && config.draw.type,
              config.fill.type !== 'none' && `fill:${config.fill.type}`,
              config.echo.enabled && 'echo',
              config.glow.enabled && 'glow',
            ]
              .filter(Boolean)
              .join(' · ') || 'static'}
          </span>
          <span>{size}px</span>
        </div>
      </div>

      {/* ─── Composer panel ──────────────────────────────────────────────── */}
      <aside
        style={{
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          borderRadius: 20,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          position: 'sticky',
          top: 32,
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: palette.textMuted,
              fontFamily: 'var(--font-mono)',
              marginBottom: 6,
            }}
          >
            Compose
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 500,
              color: palette.textPrimary,
              letterSpacing: '-0.015em',
            }}
          >
            Build your loader
          </h2>
        </div>

        <PanelSection title="Presets" palette={palette}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {PRESETS.map((p) => (
              <PanelButton key={p.id} palette={palette} onClick={() => applyPreset(p.id)}>
                {p.label}
              </PanelButton>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <PanelButton palette={palette} onClick={() => setRestartKey((k) => k + 1)}>↻ Restart</PanelButton>
            <PanelButton palette={palette} onClick={reset}>⟲ Reset all</PanelButton>
          </div>
        </PanelSection>

        <PanelSection title="Circle" palette={palette}>
          <Toggle label="Visible" value={config.circle.visible} onChange={(v) => patch('circle', { visible: v })} palette={palette} />
          {config.circle.visible && (
            <>
              <ColorSwatchPicker
                label="Stroke color"
                value={config.circle.color}
                swatches={colorSwatches}
                onChange={(v) => patch('circle', { color: v })}
                palette={palette}
              />
              <Slider
                label="Stroke width"
                value={config.circle.strokeWidth}
                min={0.2}
                max={3}
                step={0.1}
                formatValue={(v) => v.toFixed(1)}
                onChange={(v) => patch('circle', { strokeWidth: v })}
                palette={palette}
              />
              <Slider
                label="Opacity"
                value={Math.round(config.circle.opacity * 100)}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patch('circle', { opacity: v / 100 })}
                palette={palette}
              />
            </>
          )}
        </PanelSection>

        <PanelSection title="Line" palette={palette}>
          <Toggle label="Visible" value={config.line.visible} onChange={(v) => patch('line', { visible: v })} palette={palette} />
          {config.line.visible && (
            <>
              <ColorSwatchPicker
                label="Stroke color"
                value={config.line.color}
                swatches={colorSwatches}
                onChange={(v) => patch('line', { color: v })}
                palette={palette}
              />
              <Slider
                label="Stroke width"
                value={config.line.strokeWidth}
                min={0.2}
                max={3}
                step={0.1}
                formatValue={(v) => v.toFixed(1)}
                onChange={(v) => patch('line', { strokeWidth: v })}
                palette={palette}
              />
              <Slider
                label="Opacity"
                value={Math.round(config.line.opacity * 100)}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patch('line', { opacity: v / 100 })}
                palette={palette}
              />
            </>
          )}
        </PanelSection>

        <PanelSection title="Area fill" palette={palette}>
          <Toggle label="Visible" value={config.area.visible} onChange={(v) => patch('area', { visible: v })} palette={palette} />
          {config.area.visible && (
            <>
              <ColorSwatchPicker
                label="Fill color"
                value={config.area.color}
                swatches={colorSwatches}
                onChange={(v) => patch('area', { color: v })}
                palette={palette}
              />
              <Slider
                label="Opacity"
                value={Math.round(config.area.opacity * 100)}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => patch('area', { opacity: v / 100 })}
                palette={palette}
              />
            </>
          )}
        </PanelSection>

        <PanelSection title="Transform" palette={palette} hint="whole-logo motion">
          <DropdownSelect<TransformType>
            label="Type"
            value={config.transform.type}
            options={TRANSFORM_OPTIONS}
            onChange={(v) => patch('transform', { type: v })}
            palette={palette}
          />
          {config.transform.type !== 'none' && (
            <>
              <Slider
                label="Duration"
                value={config.transform.durationMs}
                min={200}
                max={6000}
                step={50}
                unit="ms"
                onChange={(v) => patch('transform', { durationMs: v })}
                palette={palette}
              />
              <Slider
                label="Amplitude"
                value={config.transform.amplitude}
                min={0}
                max={150}
                unit="%"
                onChange={(v) => patch('transform', { amplitude: v })}
                palette={palette}
              />
              <DropdownSelect<EasingKey>
                label="Easing"
                value={config.transform.easing}
                options={EASING_OPTIONS}
                onChange={(v) => patch('transform', { easing: v })}
                palette={palette}
              />
              <Toggle label="Reverse" value={config.transform.reverse} onChange={(v) => patch('transform', { reverse: v })} palette={palette} />
            </>
          )}
        </PanelSection>

        <PanelSection title="Draw" palette={palette} hint="stroke-on / orbit">
          <DropdownSelect<DrawType>
            label="Type"
            value={config.draw.type}
            options={DRAW_OPTIONS}
            onChange={(v) => patch('draw', { type: v })}
            palette={palette}
          />
          {config.draw.type !== 'none' && (
            <>
              <Slider
                label="Duration"
                value={config.draw.durationMs}
                min={200}
                max={6000}
                step={50}
                unit="ms"
                onChange={(v) => patch('draw', { durationMs: v })}
                palette={palette}
              />
              {config.draw.type.startsWith('trace') && (
                <>
                  <Slider
                    label="Hold"
                    value={config.draw.holdMs}
                    min={0}
                    max={3000}
                    step={50}
                    unit="ms"
                    onChange={(v) => patch('draw', { holdMs: v })}
                    palette={palette}
                  />
                  <Slider
                    label="Erase"
                    value={config.draw.eraseMs}
                    min={0}
                    max={3000}
                    step={50}
                    unit="ms"
                    onChange={(v) => patch('draw', { eraseMs: v })}
                    palette={palette}
                  />
                </>
              )}
              {config.draw.type === 'trace-both' && (
                <Slider
                  label="Line stagger"
                  value={config.draw.staggerMs}
                  min={0}
                  max={1500}
                  step={20}
                  unit="ms"
                  onChange={(v) => patch('draw', { staggerMs: v })}
                  palette={palette}
                />
              )}
              <DropdownSelect<EasingKey>
                label="Easing"
                value={config.draw.easing}
                options={EASING_OPTIONS}
                onChange={(v) => patch('draw', { easing: v })}
                palette={palette}
              />
              <Toggle label="Reverse" value={config.draw.reverse} onChange={(v) => patch('draw', { reverse: v })} palette={palette} />
            </>
          )}
        </PanelSection>

        <PanelSection title="Fill animation" palette={palette} hint="chart area">
          <DropdownSelect<FillType>
            label="Type"
            value={config.fill.type}
            options={FILL_OPTIONS}
            onChange={(v) => patch('fill', { type: v })}
            palette={palette}
          />
          {config.fill.type !== 'none' && (
            <>
              <Slider
                label="Duration"
                value={config.fill.durationMs}
                min={400}
                max={6000}
                step={50}
                unit="ms"
                onChange={(v) => patch('fill', { durationMs: v })}
                palette={palette}
              />
              <DropdownSelect<EasingKey>
                label="Easing"
                value={config.fill.easing}
                options={EASING_OPTIONS}
                onChange={(v) => patch('fill', { easing: v })}
                palette={palette}
              />
            </>
          )}
        </PanelSection>

        <PanelSection title="Echo rings" palette={palette}>
          <Toggle label="Enabled" value={config.echo.enabled} onChange={(v) => patch('echo', { enabled: v })} palette={palette} />
          {config.echo.enabled && (
            <>
              <Slider
                label="Rings"
                value={config.echo.rings}
                min={1}
                max={4}
                onChange={(v) => patch('echo', { rings: v })}
                palette={palette}
              />
              <Slider
                label="Duration"
                value={config.echo.durationMs}
                min={500}
                max={4000}
                step={50}
                unit="ms"
                onChange={(v) => patch('echo', { durationMs: v })}
                palette={palette}
              />
              <Slider
                label="Ring stagger"
                value={config.echo.staggerMs}
                min={0}
                max={2000}
                step={50}
                unit="ms"
                onChange={(v) => patch('echo', { staggerMs: v })}
                palette={palette}
              />
              <Slider
                label="Max radius"
                value={config.echo.maxRadius}
                min={17}
                max={40}
                step={0.5}
                formatValue={(v) => v.toFixed(1)}
                onChange={(v) => patch('echo', { maxRadius: v })}
                palette={palette}
              />
              <Slider
                label="Stroke"
                value={config.echo.strokeWidth}
                min={0.2}
                max={3}
                step={0.1}
                formatValue={(v) => v.toFixed(1)}
                onChange={(v) => patch('echo', { strokeWidth: v })}
                palette={palette}
              />
              <ColorSwatchPicker
                label="Ring color"
                value={config.echo.color}
                swatches={colorSwatches}
                onChange={(v) => patch('echo', { color: v })}
                palette={palette}
              />
            </>
          )}
        </PanelSection>

        <PanelSection title="Glow" palette={palette}>
          <Toggle label="Enabled" value={config.glow.enabled} onChange={(v) => patch('glow', { enabled: v })} palette={palette} />
          {config.glow.enabled && (
            <>
              <Slider
                label="Intensity"
                value={config.glow.intensity}
                min={0}
                max={100}
                onChange={(v) => patch('glow', { intensity: v })}
                palette={palette}
              />
              <ColorSwatchPicker
                label="Glow color"
                value={config.glow.color}
                swatches={colorSwatches}
                onChange={(v) => patch('glow', { color: v })}
                palette={palette}
              />
            </>
          )}
        </PanelSection>

        <PanelSection title="Stage" palette={palette} hint="preview only">
          <Slider label="Loader size" value={size} min={48} max={420} unit="px" onChange={setSize} palette={palette} />
          <SegmentedControl<BgMode>
            label="Background"
            value={bgMode}
            options={[
              { value: 'theme', label: 'BG' },
              { value: 'surface', label: 'Surface' },
              { value: 'custom', label: 'Custom' },
              { value: 'transparent', label: 'None' },
            ]}
            onChange={setBgMode}
            palette={palette}
          />
          {bgMode === 'custom' && (
            <ColorSwatchPicker value={customBg} swatches={bgSwatches} onChange={setCustomBg} palette={palette} />
          )}
          <SegmentedControl<StageShape>
            label="Shape"
            value={stageShape}
            options={[
              { value: 'square', label: 'Square' },
              { value: 'circle', label: 'Circle' },
              { value: 'phone', label: 'Phone' },
            ]}
            onChange={setStageShape}
            palette={palette}
          />
          {stageShape === 'square' && (
            <Slider label="Corner radius" value={stageRadius} min={0} max={64} unit="px" onChange={setStageRadius} palette={palette} />
          )}
          <Slider label="Inner padding" value={stagePadding} min={0} max={140} unit="px" onChange={setStagePadding} palette={palette} />
          <Toggle label="Show border" value={showBorder} onChange={setShowBorder} palette={palette} />
          <Toggle label="Grid overlay" value={showGrid} onChange={setShowGrid} palette={palette} />
          <Toggle label="Bounding box" value={showBbox} onChange={setShowBbox} palette={palette} />
        </PanelSection>

        <PanelSection title="Export" palette={palette}>
          <PanelButton palette={palette} onClick={copyConfig} full>
            {copied ? '✓ Config copied' : 'Copy config JSON'}
          </PanelButton>
        </PanelSection>
      </aside>
    </div>
  );
}

// ─── inline helpers ──────────────────────────────────────────────────────────
interface DropdownProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  palette: Palette;
}
function DropdownSelect<T extends string>({ label, value, options, onChange, palette }: DropdownProps<T>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: palette.textSecondary }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          style={{
            width: '100%',
            appearance: 'none',
            WebkitAppearance: 'none',
            padding: '8px 30px 8px 12px',
            background: palette.bg,
            color: palette.textPrimary,
            border: `1px solid ${palette.border}`,
            borderRadius: 8,
            fontSize: 12,
            fontFamily: 'inherit',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span aria-hidden style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: palette.textMuted, fontSize: 10, pointerEvents: 'none' }}>
          ▾
        </span>
      </div>
    </div>
  );
}

interface PanelButtonProps {
  onClick: () => void;
  palette: Palette;
  children: React.ReactNode;
  full?: boolean;
}
function PanelButton({ onClick, palette, children, full }: PanelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: full ? '100%' : undefined,
        padding: '8px 10px',
        fontSize: 11,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)',
        color: palette.textSecondary,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 8,
        transition: 'background 160ms ease, color 160ms ease, border-color 160ms ease',
      }}
    >
      {children}
    </button>
  );
}
