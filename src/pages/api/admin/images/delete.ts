import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR } from '../../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const name = String(form.get('name') || '');
  if (name && !name.includes('/') && !name.includes('..')) {
    await fs.unlink(path.join(UPLOADS_DIR, name)).catch(() => {});
  }
  return redirect('/admin/images');
};
