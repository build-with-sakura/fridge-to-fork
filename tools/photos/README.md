# V1.5 recipe photos — production and QA

These files are tools only. They are not part of the app build.

- `manifest.json` — the 20 photos: recipe ID, title, file name, batch, and what each photo must and must not show.
- `check_photos.py` — technical checks, duplicate checks and visual QA sheets.

## How photos load in the app (V1.4, unchanged)

- A drawn plate is always underneath. The photo fades in only after it has fully loaded.
- If the file is missing or broken, the photo is removed and the drawing stays.
- A recipe with `image: ''` shows the drawing only. The 20 new recipes are like this now.
- Photos are cropped with CSS (`object-fit: cover`, centred). They are never stretched.

## The four app crops (measured in a browser)

| Where | Part of the 1200 x 800 photo that shows |
| --- | --- |
| Phone recipe list | Centre strip only: 390–652 px wide, full height |
| Home carousel and wide-screen cards (16:10) | 1200 x 750 |
| Recipe page on phones (16:9) | 1200 x 675 |
| Recipe page on wide screens (1.88:1) | 1200 x 640 |

Safe zone: the key food sits inside the centre 400 x 640 px (x 400–800, y 80–720).
The whole plate or bowl sits inside y 80–720.

## Shared style (matches most of the approved ten)

- Photorealistic, appetising, home-cooked. Not restaurant plating.
- Bright soft natural daylight from the side. No harsh shadows.
- Light grey-white stone or marble table.
- Plain white plate or bowl (a Japanese bowl is fine for Japanese dishes).
- Optional: a striped linen napkin at the lower left, a few green leaves at the top left corner.
- Camera about 45 degrees above the table. The dish is centred, with clear space around it.
- No text, logos, watermarks, hands, people, or brand packaging.

## Verification process (contents, not file names)

1. **Technical check.** Run:
   `python3 tools/photos/check_photos.py <folder> --batch <n>`
   It fails on: wrong or unknown file name, wrong batch, overwriting an approved photo,
   not WebP, not 1200 x 800, multi-frame, over 300 KB, missing files,
   an exact copy, or a near copy (the same picture renamed or re-saved) of any photo.
2. **Blind check.** Open `batchN-1-blind.png`. The photos are numbered in a random order with no file names.
   Write down which dish each one shows, using only what is visible.
3. **Match.** Compare those answers with `batchN-blind-key.json`. Any mismatch fails.
4. **Content check.** For each photo, check every "must show" and "must not show" item in `manifest.json`,
   and its "telltale" (how it differs from similar dishes).
5. **Crop check.** Open each `crops-<id>.png`. The dish must still be recognisable in all crops,
   including the narrowest phone strip.
6. **Style check.** Open `batchN-3-style-vs-approved.png`. The new photos must sit well next to the approved ones.
7. **In the app.** Add the batch on the feature branch, set each recipe's `image` field, and check
   the list, carousel and recipe page on 320, 375 and 390 px phones and a wide screen.

## Visual QA checklist (per photo)

- [ ] Shows the correct dish (blind check matches the file name)
- [ ] Every "must show" item is visible; no "must not show" item appears
- [ ] Looks different from similar dishes in the app (see "telltale")
- [ ] Landscape, 1200 x 800, WebP, under 150 KB (300 KB maximum)
- [ ] Not a copy or near copy of any other photo
- [ ] Key food inside the safe zone; nothing important cut off
- [ ] Recognisable in all four app crops, including the narrowest phone strip
- [ ] Matches the shared style: light, daylight, white tableware, similar angle
- [ ] Looks realistic: no melted shapes, extra utensils, strange text or odd hands
- [ ] Food matches the recipe (no ingredients the recipe does not use as the main feature)
