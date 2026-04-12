import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR, slugify } from '../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) return redirect('/admin/images?error=1');

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const ext = path.extname(file.name) || '';
  const base = slugify(path.basename(file.name, ext)) || 'fil';
  const name = `${base}-${Date.now()}${ext.toLowerCase()}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, name), buf);
  return redirect('/admin/images');
};
