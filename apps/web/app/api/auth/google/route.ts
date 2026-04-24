import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { getSiteUrl } from "../../../../lib/server-env";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const redirectTo = requestUrl.searchParams.get("redirect") || "/account";
  const origin = getSiteUrl();

  const callbackUrl = `${origin}/api/auth/callback?next=${encodeURIComponent(redirectTo)}`;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error) {
    console.error("Google Login Error:", error.message);
    return NextResponse.redirect(`${origin}/login?error=google`);
  }

  if (data.url) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.redirect(`${origin}/login`);
}
