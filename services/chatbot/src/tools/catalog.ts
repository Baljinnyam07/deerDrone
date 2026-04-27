import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are missing!");
}

const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseKey || "placeholder");


export async function searchProductsTool(query: string, limit = 6) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description, product_images(url)")
    .ilike("name", `%${query}%`)
    .limit(limit);

  if (error) {
    console.error("searchProductsTool error", error);
    return [];
  }

  return data || [];
}

export async function getAllProductsTool() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, short_description, description, category_id, hero_note, product_images(url)");

  if (error) {
    console.error("getAllProductsTool error", error);
    return [];
  }
  return data || [];
}

export async function getProductsByIdsTool(ids: string[]) {
  if (!ids || ids.length === 0) return [];
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description, description, product_images(url)")
    .in("id", ids);

  if (error) {
    console.error("getProductsByIdsTool error", error);
    return [];
  }
  return data || [];
}

export async function getProductDetailsTool(slugOrName: string) {
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description, description, product_images(url)")
    .ilike("name", `%${slugOrName}%`) // only check name since slug is missing 
    .limit(1)
    .single();

  return data;
}

export function getDeliveryInfoTool(zone: "ub" | "rural") {
  return zone === "ub"
    ? { fee: 5000, eta: "24-48 цаг" }
    : { fee: 10000, eta: "3-5 хоног" };
}

export async function captureLeadTool(
  name: string,
  phone: string,
  interest: string,
  intent?: string,
  category?: string,
  session_id?: string
) {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name,
      phone,
      interest,
      status: "new",
      source_page: "chatbot",
      ...(intent ? { intent } : {}),
      ...(category ? { category } : {}),
      ...(session_id ? { session_id } : {})
    })
    .select()
    .single();

  if (error) {
    console.error("captureLeadTool error", error);
    return null;
  }

  return data;
}

/**
 * Get featured products — is_featured = true first, then falls back to
 * all products ordered by created_at desc (newest first). Returns up to `limit`.
 */
export async function getFeaturedProductsTool(limit = 6) {
  // Try featured flag first
  const { data: featured } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description, product_images(url)")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (featured && featured.length > 0) return featured;

  // Fallback: newest products
  const { data: fallback, error } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description, product_images(url)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedProductsTool error", error);
    return [];
  }
  return fallback || [];
}

export function toChatCards(items: any[], limit = 6) {
  return items.slice(0, limit).map((product) => {
    let imageUrl = product.product_images?.[0]?.url || product.image_url || product.image;
    if (imageUrl && imageUrl.startsWith("/")) {
      imageUrl = `https://deer-drone.vercel.app${imageUrl}`;
    }
    // Facebook Messenger does not support WebP. Convert via proxy.
    if (imageUrl && imageUrl.includes(".webp") && !imageUrl.includes("wsrv.nl")) {
      imageUrl = `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&output=jpg`;
    }
    return {
      id: product.id,
      name: product.name,
      slug: product.slug ?? "",
      price: product.price ?? 0,
      heroNote: product.hero_note ?? "",
      image_url: imageUrl || undefined,
    };
  });
}

export async function getSystemPromptTool() {
  const { data } = await supabase
    .from("system_settings")
    .select("setting_value")
    .eq("setting_key", "system_prompt")
    .single();
  return data?.setting_value || "";
}

export async function getMessengerConfigTool() {
  const { data } = await supabase
    .from("messenger_config")
    .select("*")
    .limit(1)
    .single();
  return data;
}

export async function incrementTokenUsage(tokens: number) {
  try {
    const { data } = await supabase.from('system_settings').select('setting_value').eq('setting_key', 'total_tokens_used').single();
    const current = data && data.setting_value ? parseInt(data.setting_value) : 0;
    const next = current + tokens;
    
    await supabase.from('system_settings').upsert({
      setting_key: 'total_tokens_used',
      setting_value: next.toString(),
      description: 'Нийт ашигласан AI токен'
    }, { onConflict: 'setting_key' });
  } catch (err) {
    console.error("incrementTokenUsage error", err);
  }
}
