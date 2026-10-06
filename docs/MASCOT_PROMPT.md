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

## Revision prompt: make it unmistakably a Siberian husky

The first sheet read as a generic cute dog. Attach it and paste this:

```
Redraw this character sheet so the mascot is unmistakably a SIBERIAN HUSKY. Keep the flat "sticker" style, the thick #121212 ink outlines, the white background, the exact colours (#121212, #FFFFFF, #F25C05, #FFE4D3, #FAF8F4, #B8B3AA; no blue, no gradients) and the same sheet layout (head turnaround, six expressions, four full-body poses, swatches, app icon, B&W icon, sticker). Change the anatomy and markings as follows.

HEAD AND FACE (the important part)
- Classic Siberian husky mask: dark cap over the top of the head and down the sides of the face, white muzzle and cheeks, and a white "mask" around the eyes that rises into a point between the eyes up the forehead (widow's peak). The dark cap must come down over the eyes like goggles, with the white mask inside it.
- Two small white "eyebrow" spots above the eyes inside the dark cap. This is the single most recognisable husky marking. Always draw them.
- Almond-shaped eyes, slightly tilted, not round. Draw them as "ice eyes": white iris with a ring and pupil in #121212, so they read as pale husky eyes without using blue.
- A medium-length muzzle with a dark nose at the end, clearly longer than a cat's. White muzzle, white chin. The current drawing is too short and kitten-like.
- Erect triangular ears set high on the head, thickly furred, with slightly rounded tips and #F25C05 inner ears. Not oversized.
- Thick neck ruff of fur around the collar.

BODY
- Athletic, wolf-like proportions: deeper chest, longer legs, big round paws. Not a plush toy, not chibi.
- Bushy sickle-shaped tail carried curled up over the back, white underneath, dark on top.
- Two-tone coat: dark back and sides, white chest, belly, legs and tail underside.
- Orange collar stays. Optional small screwdriver behind one ear.

EXPRESSIONS AND POSES (unchanged list, same character in every one)
Neutral, happy, curious, focused (magnifier), puzzled (head tilt, one ear folded, small "?"), fixed!. Full body: standing, investigating with a magnifier, holding a phone with a cracked screen, puzzled "page not found".

RULES
- Still an original character, not based on any existing mascot.
- Must read as a husky at 32 px: the mask, eyebrow spots and ears are the priority at small sizes.
- Flat shapes only, simple enough to redraw as SVG paths. No texture, no shading beyond one flat tone, no human clothes, no neon, no meme faces.
```

Check: cover the body and look at the face alone. Mask + eyebrow spots + almond eyes should say "husky" on their own.
