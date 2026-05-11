import { supabase } from "./src/tools/catalog.js";

async function checkProducts() {
  const { data: mics } = await supabase
    .from("products")
    .select("name, category_id, categories(name)")
    .ilike("name", "%mic%");
  
  console.log("=== MIC SEARCH ===");
  console.log(JSON.stringify(mics, null, 2));

  const { data: atom } = await supabase
    .from("products")
    .select("name, category_id, categories(name)")
    .ilike("name", "%atom%");
  
  console.log("\n=== ATOM SEARCH ===");
  console.log(JSON.stringify(atom, null, 2));

  const { data: neo } = await supabase
    .from("products")
    .select("name, category_id, categories(name)")
    .ilike("name", "%neo%");
  
  console.log("\n=== NEO SEARCH ===");
  console.log(JSON.stringify(neo, null, 2));
}

checkProducts();
