import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow the home page ("/") to be public
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 2. Restrict all other routes
  // You can redirect to home or return a 403/Unatuhorized error
  return new NextResponse(
    JSON.stringify({ message: "Access Denied" }),
    { status: 403, headers: { 'content-type': 'application/json' } }
  );
}

// 3. Use a Matcher to prevent the middleware from running on 
// static files (images, favicon, etc.) and internal Next.js paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (if you want your API routes to have different logic)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};