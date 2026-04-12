import type { APIRoute } from 'astro';
import { saveTexts } from '../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const data: Record<string, string> = {};
  for (const [k, v] of form.entries()) {
    if (k.startsWith('field:')) data[k.slice(6)] = String(v);
  }
  const newKey = String(form.get('new_key') || '').trim();
  const newValue = String(form.get('new_value') || '').trim();
  if (newKey) data[newKey] = newValue;
  await saveTexts(data);
  return redirect('/admin/texts');
};
