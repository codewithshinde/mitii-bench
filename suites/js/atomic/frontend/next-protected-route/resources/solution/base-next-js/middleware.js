import { NextResponse } from "next/server";

export function middleware(request) {
  const isAuthenticated = request.cookies.get("auth")?.value === "1";
  const { pathname } = request.nextUrl;

  if (!isAuthenticated && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
