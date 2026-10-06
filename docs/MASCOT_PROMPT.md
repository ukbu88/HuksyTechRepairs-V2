# Mascot character-sheet prompt (for ChatGPT image generation)

Paste the block below into ChatGPT. If you can, attach `public/brand/mascot-neutral.svg` (or a PNG export of it) and say "keep the same character". The current v0 is original; the sheet should refine it, not replace it with a stock husky.

```
Create a character design sheet for "Husky", the mascot of Husky Tech Repairs, a small device-repair workshop in Brisbane that fixes phones, laptops and consoles and does board-level (motherboard) repair.

CHARACTER
- An original husky dog, friendly and a little bit nerdy: a calm technician who is curious about broken things, not a cartoon goofball. Age-neutral, gender-neutral. Not based on any existing mascot or character.
- Head: rounded with two upright pointed ears, the classic husky face mask (white face, dark cap over the forehead with two peaks dipping between the eyes), small fluffy cheek tufts, round dark eyes with a white highlight, small rounded nose, gentle smile.
- Body (when shown): compact, two-tone, white chest, short arms and paws, an orange collar.
- Signature details: orange inner ears, orange collar. Optional: a tiny screwdriver tucked behind one ear.

STYLE ("Bench Pop")
- Flat vector shapes with thick, even ink outlines (like a sticker). No gradients, no shading except one flat tone, no texture, no 3D, no photorealism, no soft airbrush.
- Clean geometry, slightly chunky proportions. Think modern flat sticker/illustration, not Pixar, not anime, not Disney.
- Plain white background. Nothing else in the scene.

COLOURS (use these exact values and no others)
- Ink (outlines, dark fur): #121212
- White (face mask, chest, highlights): #FFFFFF
- Signal orange (inner ears, collar, accents, one accessory at most): #F25C05
- Pale orange tint (optional, for a sticker background behind a pose): #FFE4D3
- Warm off-white (optional surface): #FAF8F4
- Neutral grey for tools only: #B8B3AA
No blue, no purple, no gradients, no extra colours.

SHEET LAYOUT (one image, landscape)
1. Turnaround of the head: front, three-quarter, side.
2. Six expressions, head only: neutral, happy, curious (one eyebrow up), focused (looking through a magnifier), puzzled (tilted head, one ear folded, small "?"), relieved/"fixed!".
3. Four full-body poses: (a) standing neutral, (b) holding a magnifier up to one eye, (c) holding a phone with a cracked screen and looking at it kindly, (d) puzzled with one ear folded for a "page not found" screen.
4. A small row of the colour swatches with their hex values.
5. A row of three "sticker" variants: head on a rounded orange square (app icon style), head only in black-and-white for small sizes (favicon), and the full character on a tilted white sticker with a thick ink border.
Label each item in small plain text. Keep everything on a white background with generous spacing so parts can be cropped out individually.

RULES
- The character must read clearly at 32 px (favicon) and at 300 px.
- Shapes must be simple enough to be redrawn as clean SVG paths.
- No text on the character, no logos, no brand names, no sunglasses, no hoodie, no human clothes, no gaming/neon styling, no tongue-out meme face.
- Keep the same character across every pose: same ear shape, same mask shape, same eye style.
```

Variations to try afterwards:
- "Same sheet, but make the ears slightly shorter and rounder and the cheek tufts bigger."
- "Same character; give me only pose (b) at 2000 px, centred, white background." (for a clean export)
- "Same character as a 16-frame sprite strip, waving." (if an animated version is ever wanted)

Dropping the result into the site: export the chosen poses as SVG (or trace them), name them `logo-mark.svg`, `mascot-neutral.svg`, `mascot-magnifier.svg`, `mascot-confused.svg`, `favicon.svg` and replace the files in `public/brand/`. No code change.
