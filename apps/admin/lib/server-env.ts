import "server-only";

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function getRequiredEnv(name: string, fallbacks: string[] = []): string {
  for (const key of [name, ...fallbacks]) {
    const value = readEnv(key);
    if (value) {
      return value;
    }
  }

  throw new Error(`Missing required environment variable: ${name}`);
}

export function getSupabaseUrl(): string {
  return getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL", ["SUPABASE_URL"]);
}

export function getSupabaseAnonKey(): string {
  return getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", ["SUPABASE_ANON_KEY"]);
}

export function getSupabaseServiceRoleKey(): string {
  return getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY", [
    "NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY",
  ]);
}

export function getAdminEmails(): string[] {
  return (readEnv("ADMIN_EMAILS") ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

