"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { getSiteUrl } from "../../lib/server-env";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Need to handle name as well if storing to profiles table, but for now just email/password
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("name") as string,
      }
    }
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function loginWithFacebook(formData: FormData) {
  const supabase = await createClient();

  const origin = getSiteUrl();
  // Read the desired post-login destination from the form
  const redirectTo = (formData.get('redirectTo') as string | null) || '/account';
  const callbackUrl = `${origin}/api/auth/callback?next=${encodeURIComponent(redirectTo)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error) {
    console.error("Facebook Login Error:", error.message);
    return;
  }

  // Supabase sends back an explicit auth URL we must navigate to for OAuth
  if (data.url) {
    redirect(data.url);
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
