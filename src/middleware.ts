import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  role?: string;
  exp?: number;
}

const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const PUBLIC_ROUTES = ["/unauthorized", ...AUTH_ROUTES];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublicRoute && !token) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let decoded: DecodedToken;
  try {
    decoded = jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAdminRoute && decoded.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Logged-in users should not access auth routes
  if (isAuthRoute && decoded) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*|favicon.ico).*)"],
};
