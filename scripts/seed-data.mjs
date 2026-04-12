// One-shot seeding of the persistent data volume.
// Runs on container start. Only copies files that don't already exist
// in DATA_DIR, so it's safe to run on every boot.
import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = process.env.DATA_DIR || path.resolve('./data');
const SEED_DIR = path.resolve(process.cwd(), 'seed');

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function copyIfMissing(src, dest) {
  const stat = await fs.stat(src);
  if (stat.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    for (const entry of await fs.readdir(src)) {
      await copyIfMissing(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    if (await exists(dest)) return;
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
    console.log(`[seed] ${path.relative(DATA_DIR, dest)}`);
  }
}

if (!(await exists(SEED_DIR))) {
  console.log('[seed] no seed/ directory, skipping');
  process.exit(0);
}

console.log(`[seed] DATA_DIR=${DATA_DIR}`);
await copyIfMissing(SEED_DIR, DATA_DIR);
console.log('[seed] done');
