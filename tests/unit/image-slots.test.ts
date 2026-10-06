import { describe, expect, it } from 'vitest';
import { IMAGE_SLOTS, getImageSlot } from '@/content/image-slots';
import { ROUTE_CATALOGUE } from '@/routes/catalogue';

describe('image slot registry', () => {
  it('has unique ids', () => {
    const ids = IMAGE_SLOTS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('every slot points at a catalogued route', () => {
    const paths = new Set(ROUTE_CATALOGUE.map((r) => r.path));
    for (const s of IMAGE_SLOTS) expect(paths.has(s.page), s.id).toBe(true);
  });
  it('briefs and alt text are present', () => {
    for (const s of IMAGE_SLOTS) {
      expect(s.brief.length).toBeGreaterThan(10);
      expect(s.alt.length).toBeGreaterThan(5);
    }
  });
  it('throws on an unregistered id', () => {
    expect(() => getImageSlot('nope')).toThrow(/Register it/);
  });
});
