import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Only protect admin routes (excluding login)
  if (path.startsWith("/admin") && !path.includes("/login")) {
    const token = request.cookies.get("admin_token");
    
    // Check for the authentication token
    if (!token || token.value !== (process.env.AUTH_TOKEN || "demo_token")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  
  // Protect API routes starting with /api/admin
  if (path.startsWith("/api/admin")) {
    const token = request.cookies.get("admin_token");
    
    if (!token || token.value !== (process.env.AUTH_TOKEN || "demo_token")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  // Match admin routes and admin API routes
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};