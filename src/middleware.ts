import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Need authentication for these routes
const PROTECTED_ROUTES = [
    "/template"
];

const ADMIN_ROUTES = [
    "/admin"
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const isAuthenticated = false;    // TODO: Replace with authentication logic

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminRoute) {
    try {
      // TODO: Check if admin here
      const isAdmin = Math.random() == 1 || true;

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      console.error("Error parsing token in middleware:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next (Next.js internals)
     * - api (API routes)
     * - static files (images, media, etc.)
     * - favicon.ico (browser icon)
     */
    "/((?!_next|api|.*\\..*|favicon.ico).*)",
  ],
};
