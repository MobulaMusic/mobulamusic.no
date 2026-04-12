import type { APIRoute } from 'astro';
import { deletePost } from '../../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const slug = String(form.get('slug') || '');
  if (slug) await deletePost(slug);
  return redirect('/admin/posts');
};
