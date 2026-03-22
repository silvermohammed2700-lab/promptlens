import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/saved", "/dashboard"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = (session?.user as { role?: string } | null)?.role;

  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!session || role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
