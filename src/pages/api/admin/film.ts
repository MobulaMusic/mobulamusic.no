import type { APIRoute } from 'astro';
import { saveFilm, slugify, type FilmProject, type FilmTrack } from '../../../lib/content';

export const prerender = false;

function parseTracks(raw: string): FilmTrack[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(t => t && typeof t.title === 'string' && typeof t.src === 'string')
      .map(t => ({
        title: String(t.title),
        src: String(t.src),
        duration: t.duration ? String(t.duration) : undefined,
      }));
  } catch {
    return [];
  }
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const mode = String(form.get('mode'));
  const title = String(form.get('title') || '').trim();
  if (!title) return redirect('/admin/film?error=1');

  const slug = mode === 'update' ? String(form.get('slug')) : slugify(title);
  if (!slug) return redirect('/admin/film?error=1');

  const data: Omit<FilmProject, 'slug'> = {
    title,
    role: String(form.get('role') || '').trim(),
    year: String(form.get('year') || '').trim() || undefined,
    poster: String(form.get('poster') || '').trim() || undefined,
    videoUrl: String(form.get('videoUrl') || '').trim() || undefined,
    description: String(form.get('description') || '').trim() || undefined,
    director: String(form.get('director') || '').trim() || undefined,
    producer: String(form.get('producer') || '').trim() || undefined,
    composer: String(form.get('composer') || '').trim() || undefined,
    editor: String(form.get('editor') || '').trim() || undefined,
    soundDesign: String(form.get('soundDesign') || '').trim() || undefined,
    photo: String(form.get('photo') || '').trim() || undefined,
    sound: String(form.get('sound') || '').trim() || undefined,
    postProduction: String(form.get('postProduction') || '').trim() || undefined,
    tracks: parseTracks(String(form.get('tracks') || '[]')),
    order: form.get('order') ? Number(form.get('order')) : undefined,
  };

  await saveFilm(slug, data);
  return redirect('/admin/film');
};
