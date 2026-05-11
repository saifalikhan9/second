import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies
    .getAll()
    .some((cookie) =>
      cookie.name.includes("better-auth.session_token")
    );
console.log(hasSessionCookie);

  if (!hasSessionCookie) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/brain/:path*",
    "/api/contents/:path*",
    "/api/share/:path*",
  ],
};