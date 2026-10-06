import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

/** WCAG relative luminance + contrast ratio, so the palette is proven, not assumed. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r!) + 0.7152 * lin(g!) + 0.0722 * lin(b!);
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

const css = readFileSync('src/styles/tokens.css', 'utf8');
function token(name: string): string {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token --${name} not found`);
  return m[1]!;
}

describe('palette contrast (BUILD_PLAN §5.2)', () => {
  it('ink text on signal orange ≥ 4.5:1', () => {
    expect(contrast(token('ink'), token('signal'))).toBeGreaterThanOrEqual(4.5);
  });
  it('white body text on signal orange is NOT allowed (documented)', () => {
    expect(contrast('#ffffff', token('signal'))).toBeLessThan(4.5);
  });
  it('signal-deep as text on canvas ≥ 4.5:1', () => {
    expect(contrast(token('signal-deep'), token('canvas'))).toBeGreaterThanOrEqual(4.5);
  });
  it('muted text on canvas, warm canvas and surface ≥ 4.5:1', () => {
    for (const bg of ['canvas', 'canvas-warm', 'surface']) {
      expect(contrast(token('ink-muted'), token(bg))).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('dark section text and muted text ≥ 4.5:1 on dark-bg; signal readable on dark', () => {
    expect(contrast(token('dark-text'), token('dark-bg'))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token('dark-muted'), token('dark-bg'))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token('signal'), token('dark-bg'))).toBeGreaterThanOrEqual(4.5);
  });
  it('status colours ≥ 4.5:1 on canvas and their tints', () => {
    for (const s of ['error', 'success', 'warning']) {
      expect(contrast(token(s), token('canvas'))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(token(s), token(`${s}-tint`))).toBeGreaterThanOrEqual(4.5);
    }
  });
});
