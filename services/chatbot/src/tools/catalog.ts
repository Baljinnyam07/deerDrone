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

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseKey || "placeholder");


export async function searchProductsTool(query: string, limit = 6) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description, product_images(url), categories(name)")
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
    .maybeSingle();

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

export async function getFeaturedProductsTool(limit = 6) {
  // 0. Get Drone category ID
  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .ilike("name", "Дрон")
    .single();

  const categoryId = cat?.id;

  // 1. Force 'DJI NEO 2 MOTION FLYMORE COMBO' to be first
  let neo2Query = supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description, product_images(url)")
    .ilike("name", "%DJI NEO 2 MOTION FLYMORE COMBO%");
  
  if (categoryId) neo2Query = neo2Query.eq("category_id", categoryId);
  const { data: neo2 } = await neo2Query.single();

  // 2. Get other featured DRONES
  let featuredQuery = supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description, product_images(url)")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (categoryId) featuredQuery = featuredQuery.eq("category_id", categoryId);
  const { data: featured } = await featuredQuery;

  let finalProducts = featured || [];

  // 3. Fallback to other DRONES if needed
  if (finalProducts.length < limit && categoryId) {
    const { data: drones } = await supabase
      .from("products")
      .select("id, name, slug, price, hero_note, short_description, product_images(url)")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (drones) {
      // Append drones that aren't already in the list
      const existingIds = new Set(finalProducts.map(p => p.id));
      for (const d of drones) {
        if (!existingIds.has(d.id)) finalProducts.push(d);
      }
    }
  }

  // Remove Neo 2 from the list if it's already there to avoid duplicates
  finalProducts = finalProducts.filter(p => p.id !== neo2?.id);

  // Prepend Neo 2 if found
  if (neo2) {
    finalProducts = [neo2, ...finalProducts];
  }

  return finalProducts.slice(0, limit);
}

export function toChatCards(items: any[], limit = 6) {
  return items.slice(0, limit).map((product) => {
    let imageUrl = product.product_images?.[0]?.url || product.image_url || product.image;
    if (imageUrl && imageUrl.startsWith("/")) {
      imageUrl = `https://www.deerdrone.mn${imageUrl}`;
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

/**
 * Returns the single cheapest product that belongs to a category
 * whose name matches `categoryKeyword` (case-insensitive ILIKE).
 * Example: categoryKeyword = "дрон" | "дагалдах"
 */
export async function getCheapestByCategory(categoryKeyword: string) {
  // First resolve matching category IDs
  const { data: cats } = await supabase
    .from("categories")
    .select("id")
    .ilike("name", `%${categoryKeyword}%`);

  const catIds = (cats ?? []).map((c: any) => c.id);

  let query = supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description, product_images(url)")
    .order("price", { ascending: true })
    .limit(1);

  if (catIds.length > 0) {
    query = query.in("category_id", catIds);
  } else {
    // Fallback: search by product name keyword
    query = query.ilike("name", `%${categoryKeyword}%`);
  }

  const { data, error } = await query.maybeSingle();
  if (error) { console.error("getCheapestByCategory error", error); return null; }
  return data;
}

/**
 * Returns ALL messenger page configs from the DB.
 * Used for multi-page webhook routing — each entry is matched by page_id.
 */
export async function getAllMessengerConfigsTool(): Promise<any[]> {
  const { data, error } = await supabase
    .from("messenger_config")
    .select("*");
  if (error) {
    console.error("getAllMessengerConfigsTool error", error);
    return [];
  }
  return data || [];
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
