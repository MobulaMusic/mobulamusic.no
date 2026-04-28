/**
 * One-time script to optimize source images before migrating to src/assets/.
 * - Converts PNG photographs to JPEG (no transparency needed)
 * - Resizes images wider than 2400px
 * - Re-compresses JPEGs to quality 85
 *
 * Run: node scripts/optimize-source-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const IMAGES_DIR = new URL('../public/images', import.meta.url).pathname;
const MAX_WIDTH = 2400;
const JPEG_QUALITY = 85;
const MIN_SIZE_FOR_RESIZE = 2 * 1024 * 1024; // 2 MB

// PNGs that are photographs/renders (no meaningful transparency)
const PNG_TO_JPEG = [
  'gemini-studio.png',
  'gemini-studio-2.png',
  'gemini-studio-3.png',
  'cello-side-studio.png',
  'drums-side-studio.png',
  'jazzband-main-studio.png',
  'opera-main-studio.png',
  'popband-preprod-main-studio.png',
  'producing-podcast.png',
  'strings-main-studio.png',
  'trumpet-side-studio.png',
  'wind-band-main-studio.png',
  'vokalrom-forside.png',
  'recording-podcast.png',
  'originalmusikk.png',
  'podkast-hero.png',
  'voice-over-film.png',
];

async function getImageFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getImageFiles(fullPath));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function processFile(filePath) {
  const name = basename(filePath);
  const ext = extname(filePath).toLowerCase();
  const fileSize = (await stat(filePath)).size;
  const isPngToConvert = PNG_TO_JPEG.includes(name);

  if (!isPngToConvert && fileSize < MIN_SIZE_FOR_RESIZE) {
    return; // Skip small files that don't need PNG conversion
  }

  const meta = await sharp(filePath).metadata();
  const needsResize = meta.width > MAX_WIDTH;

  if (!isPngToConvert && !needsResize) {
    return; // Already small enough
  }

  let pipeline = sharp(filePath);

  if (needsResize) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (isPngToConvert || ext === '.jpeg' || ext === '.jpg') {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const newExt = isPngToConvert ? '.jpg' : ext;
  const newPath = filePath.replace(/\.(png|jpe?g)$/i, newExt);
  const tempPath = newPath + '.tmp';

  await pipeline.toFile(tempPath);

  const newSize = (await stat(tempPath)).size;
  const savings = ((fileSize - newSize) / fileSize * 100).toFixed(1);

  // Remove original if converting PNG -> JPG (different filename)
  if (isPngToConvert && newPath !== filePath) {
    await unlink(filePath);
  } else if (newPath === filePath) {
    // Same filename, remove original before rename
    await unlink(filePath);
  }

  await rename(tempPath, newPath);

  console.log(
    `${name} → ${basename(newPath)}  ` +
    `${(fileSize / 1024 / 1024).toFixed(1)}MB → ${(newSize / 1024 / 1024).toFixed(1)}MB  ` +
    `(-${savings}%)` +
    (needsResize ? `  [resized ${meta.width}→${MAX_WIDTH}px]` : '') +
    (isPngToConvert ? '  [PNG→JPG]' : '')
  );
}

async function main() {
  console.log('Scanning images in', IMAGES_DIR, '...\n');
  const files = await getImageFiles(IMAGES_DIR);
  console.log(`Found ${files.length} image files\n`);

  let processed = 0;
  for (const file of files) {
    try {
      const before = basename(file);
      await processFile(file);
      processed++;
    } catch (err) {
      console.error(`ERROR processing ${file}:`, err.message);
    }
  }

  console.log(`\nDone. Processed ${processed} files.`);
}

main();
