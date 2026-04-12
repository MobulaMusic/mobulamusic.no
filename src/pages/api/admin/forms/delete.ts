import type { APIRoute } from 'astro';
import { deleteSubmission } from '../../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const id = String(form.get('id') || '');
  if (id) await deleteSubmission(id);
  return redirect('/admin/forms');
};
