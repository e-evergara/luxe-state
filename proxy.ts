import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Next.js 16 Proxy (formerly Middleware).
 *
 * Responsibilities:
 *  1. Refresh the Supabase session cookie so it stays valid across requests.
 *  2. Protect /admin/* routes:
 *     - Redirect unauthenticated users to /login
 *     - Redirect authenticated non-admins to /
 *
 * Role is read from JWT app_metadata.role (set by the sync_role_to_jwt DB
 * trigger) — no extra DB round-trips needed.
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies to both request and response so they propagate
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: getUser() refreshes the session cookie if it is about to expire.
  // Never use getSession() in a proxy/middleware — it is not authenticated.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Only guard /admin/* routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      // Not authenticated → redirect to login, preserve destination
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin role from JWT app_metadata (set by sync_role_to_jwt trigger)
    const role = (user.app_metadata as { role?: string } | undefined)?.role;

    if (role !== 'admin') {
      // Authenticated but not admin → redirect to home
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = '/';
      return NextResponse.redirect(homeUrl);
    }
  }

  // Return supabaseResponse so updated cookies are propagated to the browser
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run on all paths EXCEPT:
     * - _next/static (static assets)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
