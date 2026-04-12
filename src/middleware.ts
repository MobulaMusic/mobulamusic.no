import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, verifySession } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdmin = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdmin || isAdminApi) {
    const token = context.cookies.get(SESSION_COOKIE)?.value;
    const user = verifySession(token);
    if (!user) {
      if (pathname === '/admin/login' || pathname === '/api/auth/login') {
        return next();
      }
      if (isAdminApi) {
        return new Response(JSON.stringify({ error: 'unauthorized' }), {
          status: 401,
          headers: { 'content-type': 'application/json' },
        });
      }
      return context.redirect('/admin/login');
    }
    context.locals.user = user;
  }

  return next();
});
