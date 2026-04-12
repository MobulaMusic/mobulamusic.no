import type { APIRoute } from 'astro';
import { checkCredentials, createSession, SESSION_COOKIE, sessionMaxAge } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const user = String(form.get('user') || '');
  const pass = String(form.get('pass') || '');

  if (!checkCredentials(user, pass)) {
    return redirect('/admin/login?error=1');
  }

  cookies.set(SESSION_COOKIE, createSession(user), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: sessionMaxAge,
  });
  return redirect('/admin');
};
