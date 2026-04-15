import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

/**
 * All user-editable content lives under DATA_DIR so it can be mounted
 * as a Railway volume in production (e.g. DATA_DIR=/data).
 * Locally it defaults to ./data at the project root.
 */
export const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'));
export const BLOG_DIR = path.join(DATA_DIR, 'content', 'blog');
export const TEXTS_FILE = path.join(DATA_DIR, 'content', 'texts', 'site.json');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
export const FORMS_FILE = path.join(DATA_DIR, 'forms.json');
export const FILM_DIR = path.join(DATA_DIR, 'content', 'film');
export const REFERANSER_DIR = path.join(DATA_DIR, 'content', 'referanser');
export const KUNDER_DIR = path.join(DATA_DIR, 'content', 'kunder');

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  image?: string;
  tags?: string[];
}

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  body: string;
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const val = m[2].trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val
        .slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      data[key] = val.replace(/^["']|["']$/g, '');
    }
  }
  return { data, body: match[2] };
}

function stringifyFrontmatter(data: BlogFrontmatter, body: string): string {
  const lines = ['---'];
  lines.push(`title: "${data.title.replace(/"/g, '\\"')}"`);
  lines.push(`description: "${data.description.replace(/"/g, '\\"')}"`);
  lines.push(`date: "${data.date}"`);
  if (data.image) lines.push(`image: "${data.image}"`);
  if (data.tags?.length) lines.push(`tags: [${data.tags.map(t => `"${t}"`).join(', ')}]`);
  lines.push('---', '', body.replace(/^\n+/, ''));
  return lines.join('\n');
}

function rowToPost(slug: string, raw: string): BlogPost {
  const { data, body } = parseFrontmatter(raw);
  return {
    slug,
    title: (data.title as string) || '',
    description: (data.description as string) || '',
    date: (data.date as string) || '',
    image: data.image as string | undefined,
    tags: data.tags as string[] | undefined,
    body,
  };
}

export async function listPosts(): Promise<BlogPost[]> {
  await fs.mkdir(BLOG_DIR, { recursive: true });
  const files = await fs.readdir(BLOG_DIR);
  const posts: BlogPost[] = [];
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf8');
    posts.push(rowToPost(file.replace(/\.md$/, ''), raw));
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.md`), 'utf8');
    return rowToPost(slug, raw);
  } catch {
    return null;
  }
}

export async function savePost(slug: string, data: BlogFrontmatter, body: string): Promise<void> {
  await fs.mkdir(BLOG_DIR, { recursive: true });
  await fs.writeFile(path.join(BLOG_DIR, `${slug}.md`), stringifyFrontmatter(data, body), 'utf8');
}

export async function deletePost(slug: string): Promise<void> {
  await fs.unlink(path.join(BLOG_DIR, `${slug}.md`)).catch(() => {});
}

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

// Texts
export async function listTexts(): Promise<Record<string, string>> {
  try {
    return JSON.parse(await fs.readFile(TEXTS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

export async function saveTexts(data: Record<string, string>): Promise<void> {
  await fs.mkdir(path.dirname(TEXTS_FILE), { recursive: true });
  await fs.writeFile(TEXTS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Forms
export interface FormSubmission {
  id: string;
  form: string;
  data: Record<string, string>;
  createdAt: string;
}

export async function listSubmissions(): Promise<FormSubmission[]> {
  try {
    return JSON.parse(await fs.readFile(FORMS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

export async function addSubmission(s: FormSubmission): Promise<void> {
  await fs.mkdir(path.dirname(FORMS_FILE), { recursive: true });
  const all = await listSubmissions();
  all.unshift(s);
  await fs.writeFile(FORMS_FILE, JSON.stringify(all, null, 2), 'utf8');
}

export async function deleteSubmission(id: string): Promise<void> {
  const all = (await listSubmissions()).filter(s => s.id !== id);
  await fs.writeFile(FORMS_FILE, JSON.stringify(all, null, 2), 'utf8');
}

// ---------- Generic JSON-collection helpers ----------

async function listJsonCollection<T extends { slug: string }>(dir: string): Promise<T[]> {
  await fs.mkdir(dir, { recursive: true });
  const files = await fs.readdir(dir);
  const items: T[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    try {
      const raw = await fs.readFile(path.join(dir, file), 'utf8');
      const data = JSON.parse(raw) as T;
      items.push({ ...data, slug: file.replace(/\.json$/, '') });
    } catch {}
  }
  return items;
}

async function getJsonItem<T extends { slug: string }>(dir: string, slug: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(dir, `${slug}.json`), 'utf8');
    const data = JSON.parse(raw) as T;
    return { ...data, slug };
  } catch {
    return null;
  }
}

async function saveJsonItem<T extends { slug: string }>(dir: string, slug: string, data: Omit<T, 'slug'>): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${slug}.json`), JSON.stringify(data, null, 2), 'utf8');
}

async function deleteJsonItem(dir: string, slug: string): Promise<void> {
  await fs.unlink(path.join(dir, `${slug}.json`)).catch(() => {});
}

// ---------- Film projects ----------

export interface FilmTrack {
  title: string;
  src: string;
  duration?: string;
}

export interface FilmProject {
  slug: string;
  title: string;
  role: string;
  year?: string;
  poster?: string;
  description?: string;
  director?: string;
  producer?: string;
  composer?: string;
  editor?: string;
  soundDesign?: string;
  photo?: string;
  sound?: string;
  postProduction?: string;
  tracks: FilmTrack[];
  order?: number;
}

export const listFilms = () =>
  listJsonCollection<FilmProject>(FILM_DIR).then(items =>
    items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || (a.year && b.year ? (a.year < b.year ? 1 : -1) : 0))
  );
export const getFilm = (slug: string) => getJsonItem<FilmProject>(FILM_DIR, slug);
export const saveFilm = (slug: string, data: Omit<FilmProject, 'slug'>) => saveJsonItem<FilmProject>(FILM_DIR, slug, data);
export const deleteFilm = (slug: string) => deleteJsonItem(FILM_DIR, slug);

// ---------- Referanser (før/etter A/B) ----------

export type ReferanseKategori =
  | 'vokal'
  | 'band-og-ensemble'
  | 'singer-songwriter'
  | 'strykere-og-klassisk'
  | 'lydbok-og-voice-over'
  | 'annet';

export interface Referanse {
  slug: string;
  title: string;
  description?: string;
  kategori: ReferanseKategori;
  rawSrc: string;
  mixedSrc: string;
  rawLabel?: string;
  mixedLabel?: string;
  order?: number;
}

export const REFERANSE_KATEGORIER: { value: ReferanseKategori; label: string }[] = [
  { value: 'vokal', label: 'Vokal' },
  { value: 'band-og-ensemble', label: 'Band & ensemble' },
  { value: 'singer-songwriter', label: 'Singer-songwriter' },
  { value: 'strykere-og-klassisk', label: 'Strykere & klassisk' },
  { value: 'lydbok-og-voice-over', label: 'Lydbok & voice-over' },
  { value: 'annet', label: 'Annet' },
];

export const listReferanser = () =>
  listJsonCollection<Referanse>(REFERANSER_DIR).then(items =>
    items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  );
export const getReferanse = (slug: string) => getJsonItem<Referanse>(REFERANSER_DIR, slug);
export const saveReferanse = (slug: string, data: Omit<Referanse, 'slug'>) => saveJsonItem<Referanse>(REFERANSER_DIR, slug, data);
export const deleteReferanse = (slug: string) => deleteJsonItem(REFERANSER_DIR, slug);

// ---------- Kundedokumentasjon ----------

export interface Kunde {
  slug: string;
  kunde: string;
  sitat: string;
  rolle?: string;
  prosjekt?: string;
  prosjektUrl?: string;
  logo?: string;
  tags: string[];
  order?: number;
}

export const listKunder = () =>
  listJsonCollection<Kunde>(KUNDER_DIR).then(items =>
    items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  );
export const getKunde = (slug: string) => getJsonItem<Kunde>(KUNDER_DIR, slug);
export const saveKunde = (slug: string, data: Omit<Kunde, 'slug'>) => saveJsonItem<Kunde>(KUNDER_DIR, slug, data);
export const deleteKunde = (slug: string) => deleteJsonItem(KUNDER_DIR, slug);
