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

export function getChatbotServiceUrl(): string {
  return getRequiredEnv("CHATBOT_SERVICE_URL", ["NEXT_PUBLIC_CHATBOT_URL"]);
}

export function getOptionalChatbotServiceSecret(): string | undefined {
  return readEnv("CHATBOT_SERVICE_SECRET");
}

export function getSiteUrl(): string {
  const rawUrl =
    readEnv("NEXT_PUBLIC_SITE_URL") ??
    readEnv("SITE_URL") ??
    "https://deer-drone.vercel.app";

  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }

  return `https://${rawUrl}`;
}
