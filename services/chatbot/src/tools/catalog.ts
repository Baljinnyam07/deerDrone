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

const supabase = createClient(supabaseUrl, supabaseKey);

export async function searchProductsTool(query: string) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description")
    .ilike("name", `%${query}%`)
    .limit(3);

  if (error) {
    console.error("searchProductsTool error", error);
    return [];
  }

  return data || [];
}

export async function getAllProductsTool() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, short_description, description, category_id, hero_note");

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
    .select("id, name, slug, price, hero_note, short_description")
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
    .select("id, name, slug, price, hero_note, short_description, description")
    .or(`slug.ilike.%${slugOrName}%,name.ilike.%${slugOrName}%`)
    .limit(1)
    .single();

  return data;
}

export function getDeliveryInfoTool(zone: "ub" | "rural") {
  return zone === "ub"
    ? { fee: 5000, eta: "24-48 цаг" }
    : { fee: 10000, eta: "3-5 хоног" };
}

export async function captureLeadTool(name: string, phone: string, interest: string) {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name,
      phone,
      interest,
      status: "new",
      source_page: "chatbot",
    })
    .select()
    .single();

  if (error) {
    console.error("captureLeadTool error", error);
    return null;
  }

  return data;
}

export function toChatCards(items: any[]) {
  return items.slice(0, 2).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    heroNote: product.hero_note || "",
  }));
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
