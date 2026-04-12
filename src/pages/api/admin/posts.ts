import type { APIRoute } from 'astro';
import { savePost, slugify } from '../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const mode = String(form.get('mode'));
  const title = String(form.get('title') || '').trim();
  const description = String(form.get('description') || '').trim();
  const date = String(form.get('date') || '').trim();
  const image = String(form.get('image') || '').trim() || undefined;
  const tags = String(form.get('tags') || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
  const body = String(form.get('body') || '');

  const slug = mode === 'update' ? String(form.get('slug')) : slugify(title);
  if (!slug || !title) return redirect('/admin/posts?error=1');

  await savePost(slug, { title, description, date, image, tags }, body);
  return redirect('/admin/posts');
};
