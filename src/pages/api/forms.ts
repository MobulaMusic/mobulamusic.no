import type { APIRoute } from 'astro';
import { addSubmission } from '../../lib/content';
import crypto from 'node:crypto';

export const prerender = false;

// Public endpoint — siden sender skjemaer hit.
export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const data: Record<string, string> = {};
  let formName = 'ukjent';
  for (const [k, v] of form.entries()) {
    if (k === '_form') { formName = String(v); continue; }
    if (k === '_redirect') continue;
    data[k] = String(v);
  }
  await addSubmission({
    id: crypto.randomUUID(),
    form: formName,
    data,
    createdAt: new Date().toISOString(),
  });
  const redirectTo = String(form.get('_redirect') || '/');
  return redirect(redirectTo);
};
