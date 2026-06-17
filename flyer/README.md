# Snaggletooth Cat Rescue — Volunteer Sign-Up Flyer

Print-ready volunteer recruitment flyer (US Letter, portrait).

## Outputs
- `out/snaggletooth-volunteer-flyer.png` — high-res image (2448×3168, ~288 DPI) for screens/social.
- `out/snaggletooth-volunteer-flyer.pdf` — print-ready PDF (8.5×11 in).

## What it includes
- Snaggletooth Cat Rescue logo lockup + "Where Love Begins" tagline.
- Pink / green / purple palette with a paw-print background.
- Headline "Volunteers Wanted", clearly states it's **all about the cats**.
- "Open to high-school students, 9th grade & up".
- A real, scannable **QR code** linking to the Google volunteer form.

## Add the real cat photo
The center circle currently shows a placeholder. To drop in the real photo:
1. Save the cat image as `assets/kitten.jpg` (or `.png`).
2. In `flyer.html`, inside `<div class="photo">`, replace the placeholder
   `<div class="ph">…</div>` block with:
   ```html
   <img src="assets/kitten.jpg" alt="rescue cat">
   ```
3. Re-render (see below).

To swap the placeholder logo for the official logo, save it as `assets/logo.png`
and replace the inline `<svg class="mark">…</svg>` with `<img class="mark" src="assets/logo.png">`.

## Regenerate the QR code
```bash
python3 build_qr.py
```

## Re-render PNG + PDF
```bash
# from the repo root
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node flyer/render.mjs
```
