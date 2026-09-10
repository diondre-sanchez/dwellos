import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Coarse-grained redirect for unauthenticated page visits. Not the only
// auth check — each Server Action/page also verifies the session itself,
// since Server Functions can be called directly and bypass this matcher.
export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/homes/:path*"],
};
