import { getAllProductsTool } from "./src/tools/catalog.js";

async function test() {
  console.log("🔍 Fetching products from database...");
  try {
    const products = await getAllProductsTool();
    if (products && products.length > 0) {
      console.log(`✅ Success! Found ${products.length} products.`);
      products.forEach((p, i) => {
        console.log(`${i+1}. ${p.name} - ${p.price}₮`);
      });
    } else {
      console.warn("⚠️ No products found in the 'products' table.");
    }
  } catch (error) {
    console.error("🔥 Error fetching products:", error.message);
  }
}

test();
