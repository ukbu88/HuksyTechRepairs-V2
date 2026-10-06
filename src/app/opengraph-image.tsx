import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { business } from '@/config/business';

export const alt = `${business.tradingName} — if it has a motherboard, ask us.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Code-drawn Open Graph image: signal orange, ink type, the mark. No photography. */
export default async function OpenGraphImage() {
  const fontsDir = path.join(process.cwd(), 'src', 'fonts');
  const [display, mark] = await Promise.all([
    readFile(path.join(fontsDir, 'bricolage-grotesque-latin-800-normal.woff')),
    readFile(path.join(process.cwd(), 'public', 'brand', 'logo-mark.png')),
  ]);
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`;
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#f25c05',
        color: '#121212',
        padding: 64,
        fontFamily: 'Bricolage',
        border: '16px solid #121212',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <img src={markSrc} width={91} height={96} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 44, lineHeight: 1 }}>{business.tradingName}</div>
          <div style={{ fontSize: 24, letterSpacing: 2, marginTop: 8 }}>
            {business.city.toUpperCase()}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 96, lineHeight: 0.98, letterSpacing: -3, maxWidth: 1000 }}>
        If it has a motherboard, ask us.
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 26 }}>
        <span
          style={{ background: '#121212', color: '#ffffff', padding: '10px 18px', borderRadius: 8 }}
        >
          Repairs
        </span>
        <span
          style={{ background: '#121212', color: '#ffffff', padding: '10px 18px', borderRadius: 8 }}
        >
          Motherboard repairs
        </span>
        <span
          style={{
            background: '#ffffff',
            color: '#121212',
            padding: '10px 18px',
            borderRadius: 8,
            border: '3px solid #121212',
          }}
        >
          Start a repair
        </span>
      </div>
    </div>,
    { ...size, fonts: [{ name: 'Bricolage', data: display, weight: 800, style: 'normal' }] },
  );
}
