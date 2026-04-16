import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getAdminEmails, getSupabaseAnonKey, getSupabaseUrl } from "./server-env";

export async function requireAdminApi(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
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
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const adminEmails = getAdminEmails();
  const email = user.email?.toLowerCase() ?? "";

  if (!email || !adminEmails.includes(email)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true as const,
    user,
    response,
  };
}

/**
 * Шинэчлэгдсэн session cookie-г API response дээр буцааж тавина.
 * Auth шалгасны дараа энэ функцийг ашиглан response буцааж байж токен
 * browser-т зөв хадгалагдана.
 *
 * Жишээ:
 *   return withAuthCookies(auth.response, NextResponse.json({ ok: true }));
 */
export function withAuthCookies(
  authResponse: NextResponse,
  apiResponse: NextResponse,
): NextResponse {
  authResponse.cookies.getAll().forEach(({ name, value, ...rest }) => {
    apiResponse.cookies.set({ name, value, ...rest });
  });
  return apiResponse;
}
