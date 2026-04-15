import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR } from '../../lib/content';

export const prerender = false;

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.mp4': 'audio/mp4',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.oga': 'audio/ogg',
  '.flac': 'audio/flac',
  '.webm': 'audio/webm',
};

export const GET: APIRoute = async ({ params }) => {
  const rel = String(params.file || '');
  // Harden against traversal
  const abs = path.resolve(UPLOADS_DIR, rel);
  if (!abs.startsWith(UPLOADS_DIR + path.sep)) {
    return new Response('Forbidden', { status: 403 });
  }
  try {
    const buf = await fs.readFile(abs);
    const type = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
    return new Response(new Uint8Array(buf), {
      headers: {
        'content-type': type,
        'cache-control': 'public, max-age=3600',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
