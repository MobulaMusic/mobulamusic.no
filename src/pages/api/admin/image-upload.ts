import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR, slugify } from '../../../lib/content';

export const prerender = false;

// JSON image upload endpoint for inline uploaders in admin editors.
// Returns { url } on success. Mirrors audio.ts but writes to data/uploads/
// directly so existing /uploads/<file> routing works unchanged.
export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return new Response(JSON.stringify({ error: 'Ingen fil' }), { status: 400 });
  }
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const ext = path.extname(file.name) || '';
  const base = slugify(path.basename(file.name, ext)) || 'bilde';
  const name = `${base}-${Date.now()}${ext.toLowerCase()}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, name), buf);
  return new Response(JSON.stringify({ url: `/uploads/${name}` }), {
    headers: { 'content-type': 'application/json' },
  });
};
