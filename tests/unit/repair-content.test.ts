import { describe, expect, it } from 'vitest';
import { REPAIR_CONTENT, COMMON_REPAIRS } from '@/content/repair';
import { DEVICE_CATEGORY_SLUGS } from '@/content/device-categories';
import { IMAGE_SLOTS } from '@/content/image-slots';

const BANNED =
  /world-class|cutting-edge|seamless|premium quality|industry-leading|revolutionary|trusted experts|state-of-the-art|best in brisbane|unmatched/i;
const INVENTED =
  /\$\d|same[- ]day|\b\d+\s?(hour|day|week)s?\b|guarantee(d)? (to|that) (fix|repair)|lifetime warranty|\d+ ?(month|year)s? warranty/i;

describe('repair category content', () => {
  it('exists for every category slug', () => {
    for (const slug of DEVICE_CATEGORY_SLUGS) {
      const c = REPAIR_CONTENT[slug];
      expect(c.slug).toBe(slug);
      expect(c.symptoms.length).toBeGreaterThanOrEqual(5);
      expect(c.causes.length).toBeGreaterThanOrEqual(4);
      expect(c.diagnosis.length).toBeGreaterThanOrEqual(2);
      expect(c.options.length).toBeGreaterThanOrEqual(4);
      expect(c.faq.length).toBeGreaterThanOrEqual(2);
      expect(c.stickers).toHaveLength(3);
    }
  });

  it('has a registered image slot per category', () => {
    const ids = new Set(IMAGE_SLOTS.map((s) => s.id));
    for (const slug of DEVICE_CATEGORY_SLUGS) expect(ids.has(`repair-${slug}`)).toBe(true);
  });

  it('uses no copy-slop phrases and invents no prices, turnaround or warranty', () => {
    const text = JSON.stringify(REPAIR_CONTENT) + JSON.stringify(COMMON_REPAIRS);
    expect(text).not.toMatch(BANNED);
    expect(text).not.toMatch(INVENTED);
  });

  it('never claims everything is repairable', () => {
    const text = JSON.stringify(REPAIR_CONTENT).toLowerCase();
    expect(text).not.toMatch(/we (can )?(repair|fix) (anything|everything)[^.]*\./);
  });
});
