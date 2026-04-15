import type { APIRoute } from 'astro';
import { deleteFilm } from '../../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const slug = String(form.get('slug') || '');
  if (slug) await deleteFilm(slug);
  return redirect('/admin/film');
};
