import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/unauthorized"];

const PROTECTED_ROUTES = ["/template"];

const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  const token = request.cookies.get("token")?.value;

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // optional: keep track of where they tried to go
    return NextResponse.redirect(loginUrl);
  }

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const isAuthenticated = false; // TODO: Replace with authentication logic

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
