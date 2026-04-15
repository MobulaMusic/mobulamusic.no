import type { APIRoute } from 'astro';
import { saveReferanse, slugify, type Referanse, type ReferanseKategori, REFERANSE_KATEGORIER } from '../../../lib/content';

export const prerender = false;

const VALID_KATEGORIER = new Set(REFERANSE_KATEGORIER.map(k => k.value));

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const mode = String(form.get('mode'));
  const title = String(form.get('title') || '').trim();
  const rawSrc = String(form.get('rawSrc') || '').trim();
  const mixedSrc = String(form.get('mixedSrc') || '').trim();
  const kategoriRaw = String(form.get('kategori') || '').trim();

  if (!title || !rawSrc || !mixedSrc || !VALID_KATEGORIER.has(kategoriRaw as ReferanseKategori)) {
    return redirect('/admin/referanser?error=1');
  }

  const slug = mode === 'update' ? String(form.get('slug')) : slugify(title);
  if (!slug) return redirect('/admin/referanser?error=1');

  const data: Omit<Referanse, 'slug'> = {
    title,
    description: String(form.get('description') || '').trim() || undefined,
    kategori: kategoriRaw as ReferanseKategori,
    rawSrc,
    mixedSrc,
    rawLabel: String(form.get('rawLabel') || '').trim() || undefined,
    mixedLabel: String(form.get('mixedLabel') || '').trim() || undefined,
    order: form.get('order') ? Number(form.get('order')) : undefined,
  };

  await saveReferanse(slug, data);
  return redirect('/admin/referanser');
};
