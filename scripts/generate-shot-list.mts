/**
 * Generates docs/SHOT_LIST.md from src/content/image-slots.ts so there is one
 * shot list to work through. Runs after every build (postbuild) and via `npm run shot-list`.
 * Executed by Node's native TypeScript support (no extra tooling).
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { IMAGE_SLOTS } from '../src/content/image-slots.ts';

const root = process.cwd();
const photosDir = path.join(root, 'public', 'photos');
const extensions = ['jpg', 'jpeg', 'webp', 'png'];

function status(id: string): string {
  for (const ext of extensions) {
    if (existsSync(path.join(photosDir, `${id}.${ext}`))) return `✅ \`${id}.${ext}\``;
  }
  return '⬜ needed';
}

const byPage = new Map<string, typeof IMAGE_SLOTS>();
for (const slot of IMAGE_SLOTS) {
  byPage.set(slot.page, [...(byPage.get(slot.page) ?? []), slot]);
}

const lines: string[] = [
  '# Shot list',
  '',
  '_Generated from `src/content/image-slots.ts` by `npm run shot-list` (also runs after every build). Do not edit by hand._',
  '',
  'Drop each photo into `public/photos/<slot-id>.jpg` (or `.webp` / `.png`). The site picks it up automatically; no code change.',
  '',
  'Rules (Canon §28): real work only. No stock, no AI-generated, no staged "technician" imagery. A slightly imperfect real photo beats a perfect generic one.',
  '',
  `Total slots: ${IMAGE_SLOTS.length}`,
  '',
];

for (const [page, slots] of [...byPage.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  lines.push(`## ${page}`, '');
  lines.push('| Slot id | Aspect | What to shoot | Notes | Status |');
  lines.push('|---|---|---|---|---|');
  for (const s of slots) {
    lines.push(`| \`${s.id}\` | ${s.aspect} | ${s.brief} | ${s.notes ?? ''} | ${status(s.id)} |`);
  }
  lines.push('');
}

mkdirSync(path.join(root, 'docs'), { recursive: true });
const out = path.join(root, 'docs', 'SHOT_LIST.md');
writeFileSync(out, lines.join('\n'));
console.log(`[shot-list] wrote ${path.relative(root, out)} (${IMAGE_SLOTS.length} slots)`);
