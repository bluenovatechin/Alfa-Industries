// Creates WebP versions of the large photos (hero slides, application tiles):
//   assets/images/slider001.jpg -> slider001-640.webp (phones) + slider001.webp (full width)
// Run after adding or replacing a photo:  npm run images
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve('public/assets/images');
for (const file of fs.readdirSync(dir).filter((f) => /^slider\d+\.jpg$/.test(f))) {
  const src = path.join(dir, file);
  const base = file.replace(/\.jpg$/, '');
  const { width } = await sharp(src).metadata();
  await sharp(src).resize({ width: Math.min(640, width) }).webp({ quality: 72 }).toFile(path.join(dir, `${base}-640.webp`));
  await sharp(src).webp({ quality: 76 }).toFile(path.join(dir, `${base}.webp`));
  const kb = (f) => Math.round(fs.statSync(path.join(dir, f)).size / 1024) + ' KB';
  console.log(`${file} (${kb(file)}) -> ${base}-640.webp (${kb(base + '-640.webp')}), ${base}.webp (${kb(base + '.webp')})`);
}
