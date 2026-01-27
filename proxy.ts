
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ ROUTES PUBLIQUES
  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next();
  }

  const session = await auth();

  // 🔒 SEULEMENT routes privées
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/services/:path*",
    "/post_list/:path*",
  ],
};
