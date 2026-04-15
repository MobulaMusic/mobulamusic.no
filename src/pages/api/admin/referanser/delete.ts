import type { APIRoute } from 'astro';
import { deleteReferanse } from '../../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const slug = String(form.get('slug') || '');
  if (slug) await deleteReferanse(slug);
  return redirect('/admin/referanser');
};
