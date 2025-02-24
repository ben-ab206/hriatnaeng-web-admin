import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Add paths that don't require authentication
const publicPaths = ['/auth', '/auth/login', '/auth/register'];

// Add paths that should be protected
const protectedPaths = ['/dashboard', '/users', '/contact', '/settings'];

export async function middleware(request: NextRequest) {
  // Skip middleware for tRPC requests
  if (request.nextUrl.pathname.startsWith('/api/trpc')) {
    return NextResponse.next();
  }

  // Update the session
  const response = await updateSession(request);
  const session = response.headers.get('x-session-user');

  const pathname = request.nextUrl.pathname;

  // Check if the path should be protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // If there's no session and trying to access protected route
  if (!session && isProtectedPath) {
    const redirectUrl = new URL('/auth', request.url);
    // Add the original URL as a "from" parameter to redirect back after login
    redirectUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a session and trying to access auth pages
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api/trpc|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/users/:path*",
    "/contact/:path*",
  ]
}