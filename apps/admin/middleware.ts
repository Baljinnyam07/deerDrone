import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  getAdminEmails,
  getSupabaseAnonKey,
  getSupabaseUrl,
} from "./lib/server-env";

const ADMIN_EMAILS = getAdminEmails();

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Allow API routes through (they handle their own auth)
  if (request.nextUrl.pathname.startsWith("/api")) {
    return response;
  }

  // Allow login page
  if (request.nextUrl.pathname === "/login") {
    return response;
  }

  try {
    const supabase = createServerClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")) {
      // Not authenticated or not admin — redirect to login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  } catch {
    // Fail closed in production. In local development we still allow access
    // so the UI can boot before Supabase is configured.
    if (process.env.NODE_ENV !== "production") {
      return response;
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "configuration");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|api).*)"],
};
