import type { APIRoute } from 'astro';
import { saveKunde, slugify, type Kunde } from '../../../lib/content';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const mode = String(form.get('mode'));
  const kunde = String(form.get('kunde') || '').trim();
  const sitat = String(form.get('sitat') || '').trim();
  if (!kunde || !sitat) return redirect('/admin/kunder?error=1');

  const slug = mode === 'update' ? String(form.get('slug')) : slugify(kunde);
  if (!slug) return redirect('/admin/kunder?error=1');

  const tags = String(form.get('tags') || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  const data: Omit<Kunde, 'slug'> = {
    kunde,
    sitat,
    rolle: String(form.get('rolle') || '').trim() || undefined,
    prosjekt: String(form.get('prosjekt') || '').trim() || undefined,
    prosjektUrl: String(form.get('prosjektUrl') || '').trim() || undefined,
    logo: String(form.get('logo') || '').trim() || undefined,
    tags,
    order: form.get('order') ? Number(form.get('order')) : undefined,
  };

  await saveKunde(slug, data);
  return redirect('/admin/kunder');
};
