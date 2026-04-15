import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR, slugify } from '../../../lib/content';

export const prerender = false;

const AUDIO_DIR = path.join(UPLOADS_DIR, 'audio');

// JSON upload endpoint for use from admin editors via fetch().
// Returns { url } on success.
export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return new Response(JSON.stringify({ error: 'Ingen fil' }), { status: 400 });
  }
  await fs.mkdir(AUDIO_DIR, { recursive: true });
  const ext = path.extname(file.name) || '.mp3';
  const base = slugify(path.basename(file.name, ext)) || 'lyd';
  const name = `${base}-${Date.now()}${ext.toLowerCase()}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(AUDIO_DIR, name), buf);
  return new Response(JSON.stringify({ url: `/uploads/audio/${name}` }), {
    headers: { 'content-type': 'application/json' },
  });
};
