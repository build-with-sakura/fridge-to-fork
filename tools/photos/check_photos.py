#!/usr/bin/env python3
"""
Fridge to Fork photo checker (V1.5). Not part of the app build.

Usage:
  python3 tools/photos/check_photos.py <incoming-folder> --batch 1 [--out <folder>]

What it does:
  1. Technical checks on every file: name in the manifest and in this
     batch, real WebP, 1200x800, RGB, single frame, file size.
  2. Duplicate checks against each other AND the approved photos:
     exact (same bytes) and near (same picture re-saved or renamed).
  3. Style numbers compared with the approved photos (brightness,
     background tone). Shown as notes, not pass/fail.
  4. Sheets for the visual check:
     - blind sheet: photos numbered, NO file names (identify the dish first)
     - labelled sheet: the same photos with file names
     - one crop sheet per photo: full frame with safe zone, and the four
       app crops (phone list narrowest/widest, carousel 16:10, detail 16:9,
       detail wide 1.88:1)
"""
import argparse, hashlib, json, os, random, statistics, sys
from PIL import Image, ImageDraw, ImageStat

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
W, H = 1200, 800
# Visible part of a 1200x800 photo in each app frame (measured in a browser).
CROPS = [
    ('Phone list, narrowest', 390, 800),
    ('Phone list, widest', 652, 800),
    ('Carousel / wide card 16:10', 1200, 750),
    ('Detail, phone 16:9', 1200, 675),
    ('Detail, wide 1.88:1', 1200, 640),
]
SAFE = (400, 80, 800, 720)


def dhash(im, size=12):
    g = im.convert('L').resize((size + 1, size), Image.LANCZOS)
    px = list(g.get_flattened_data() if hasattr(g, 'get_flattened_data') else g.getdata())
    bits = 0
    for y in range(size):
        for x in range(size):
            bits = (bits << 1) | (px[y * (size + 1) + x] > px[y * (size + 1) + x + 1])
    return bits


def ham(a, b):
    return bin(a ^ b).count('1')


def border_tone(im):
    rgb = im.convert('RGB').resize((120, 80))
    pts = [rgb.getpixel((x, y)) for x in range(120) for y in range(80) if x < 8 or x > 111 or y < 6 or y > 73]
    return tuple(round(statistics.mean(c[i] for c in pts)) for i in range(3))


def centre_crop(im, cw, ch):
    x0, y0 = (W - cw) // 2, (H - ch) // 2
    return im.crop((x0, y0, x0 + cw, y0 + ch))


def crop_sheet(im, name, path):
    th = 260
    full = im.copy().convert('RGB')
    d = ImageDraw.Draw(full)
    d.rectangle(SAFE, outline=(255, 0, 140), width=6)
    tiles = [('Full frame + safe zone', full)] + [(n, centre_crop(im.convert('RGB'), cw, ch)) for n, cw, ch in CROPS]
    tiles = [(n, t.resize((max(1, round(t.width * th / t.height)), th))) for n, t in tiles]
    sheet = Image.new('RGB', (sum(t.width for _, t in tiles) + 12 * (len(tiles) + 1), th + 54), 'white')
    dd = ImageDraw.Draw(sheet)
    dd.text((12, 6), name, fill='black')
    x = 12
    for n, t in tiles:
        sheet.paste(t, (x, 30)); dd.text((x, th + 36), n, fill=(60, 60, 60)); x += t.width + 12
    sheet.save(path)


def grid(items, path, labels):
    tw, th = 360, 240
    cols = min(5, len(items)) or 1
    rows = (len(items) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * (tw + 10) + 10, rows * (th + 30) + 10), 'white')
    d = ImageDraw.Draw(sheet)
    for k, (lab, im) in enumerate(zip(labels, items)):
        x, y = 10 + (k % cols) * (tw + 10), 10 + (k // cols) * (th + 30)
        sheet.paste(im.convert('RGB').resize((tw, th)), (x, y + 22)); d.text((x, y + 4), lab, fill='black')
    sheet.save(path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('folder'); ap.add_argument('--batch', type=int, required=True)
    ap.add_argument('--out', default='photo-check-out'); ap.add_argument('--approved', default=os.path.join(ROOT, 'public', 'images'))
    a = ap.parse_args()
    man = json.load(open(os.path.join(HERE, 'manifest.json')))
    rules = man['rules']; by_file = {p['file']: p for p in man['photos']}
    batch_files = [by_file_id['file'] for by_file_id in man['photos'] if by_file_id['id'] in man['batches'][a.batch - 1]]
    os.makedirs(a.out, exist_ok=True)
    fails, notes = [], []

    approved = {f: Image.open(os.path.join(a.approved, f)) for f in sorted(os.listdir(a.approved)) if f.endswith('.webp')}
    ref_tone = [border_tone(i) for i in approved.values()]
    ref_bright = [ImageStat.Stat(i.convert('L')).mean[0] for i in approved.values()]

    incoming = sorted(f for f in os.listdir(a.folder) if not f.startswith('.'))
    got = {}
    for f in incoming:
        p = os.path.join(a.folder, f)
        if f not in by_file: fails.append(f + ': file name is not in the manifest'); continue
        if f not in batch_files: fails.append(f + ': belongs to a different batch')
        if f in approved: fails.append(f + ': would overwrite an approved photo')
        try:
            im = Image.open(p); im.load()
        except Exception as e:
            fails.append(f + ': cannot be opened (' + str(e) + ')'); continue
        kb = os.path.getsize(p) / 1024
        if im.format != 'WEBP': fails.append(f'{f}: format is {im.format}, not WebP')
        if im.size != (W, H): fails.append(f'{f}: size is {im.size[0]}x{im.size[1]}, needs {W}x{H}')
        if im.mode not in ('RGB',): notes.append(f'{f}: colour mode {im.mode} (RGB expected)')
        if getattr(im, 'n_frames', 1) > 1: fails.append(f + ': animated or multi-frame')
        if kb > rules['maxKB']: fails.append(f'{f}: {kb:.0f} KB is over the {rules["maxKB"]} KB maximum')
        elif kb > rules['targetKB']: notes.append(f'{f}: {kb:.0f} KB is over the {rules["targetKB"]} KB target (allowed)')
        got[f] = (im, hashlib.sha256(open(p, 'rb').read()).hexdigest(), kb)
    for f in batch_files:
        if f not in got: fails.append(f + ': missing from this batch')

    # duplicates: exact and near, against each other and the approved ten
    pool = {('approved/' + f): (im, hashlib.sha256(open(os.path.join(a.approved, f), 'rb').read()).hexdigest()) for f, im in approved.items()}
    pool.update({('new/' + f): (v[0], v[1]) for f, v in got.items()})
    hashes = {k: dhash(v[0]) for k, v in pool.items()}
    keys = sorted(pool)
    for i in range(len(keys)):
        for j in range(i + 1, len(keys)):
            k1, k2 = keys[i], keys[j]
            if not (k1.startswith('new/') or k2.startswith('new/')): continue
            if pool[k1][1] == pool[k2][1]: fails.append(f'{k1} and {k2} are the same file')
            elif ham(hashes[k1], hashes[k2]) <= 12: fails.append(f'{k1} and {k2} look like the same picture (distance {ham(hashes[k1], hashes[k2])})')

    # style notes
    lo, hi = min(ref_bright) - 15, max(ref_bright) + 15
    for f, (im, _, kb) in got.items():
        b = ImageStat.Stat(im.convert('L')).mean[0]
        tone = border_tone(im)
        near = min(sum(abs(t - r) for t, r in zip(tone, rt)) for rt in ref_tone)
        if not lo <= b <= hi: notes.append(f'{f}: brightness {b:.0f} is outside the approved range {lo:.0f}-{hi:.0f}')
        if near > 90: notes.append(f'{f}: background tone {tone} is unlike any approved photo')

    # sheets
    files = [f for f in batch_files if f in got]
    order = files[:]; random.Random(a.batch).shuffle(order)
    grid([got[f][0] for f in order], os.path.join(a.out, f'batch{a.batch}-1-blind.png'), [f'Photo {k + 1}' for k in range(len(order))])
    json.dump({f'Photo {k + 1}': f for k, f in enumerate(order)}, open(os.path.join(a.out, f'batch{a.batch}-blind-key.json'), 'w'), indent=1)
    grid([got[f][0] for f in files], os.path.join(a.out, f'batch{a.batch}-2-labelled.png'), files)
    grid([got[f][0] for f in files] + list(approved.values())[:5], os.path.join(a.out, f'batch{a.batch}-3-style-vs-approved.png'), files + ['approved: ' + f for f in list(approved)[:5]])
    for f in files:
        crop_sheet(got[f][0], f, os.path.join(a.out, f'crops-{f.replace(".webp", "")}.png'))

    print(f'Batch {a.batch}: {len(got)} file(s) checked, expected {len(batch_files)}')
    for f in files: print(f'  {f}: {got[f][0].size[0]}x{got[f][0].size[1]} {got[f][0].format} {got[f][2]:.0f} KB')
    print('FAIL:' if fails else 'No technical failures.'); [print('  - ' + x) for x in fails]
    if notes: print('Notes:'); [print('  - ' + x) for x in notes]
    print('Sheets written to ' + os.path.abspath(a.out))
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
