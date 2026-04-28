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

  const response = await next();

  // Cache static assets aggressively (hashed filenames = safe to cache forever)
  if (pathname.startsWith('/fonts/') || pathname.startsWith('/og/') || pathname.startsWith('/_astro/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // Cache HTML pages at CDN edge for 1 hour, revalidate in background
  else if (!isAdmin && !isAdminApi && !pathname.startsWith('/api/') && !pathname.startsWith('/uploads/')) {
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  }

  return response;
});
