import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

// Load .env.local from the absolute app root
dotenv.config({ path: "c:/Users/user/Desktop/deerDrone/apps/web/.env.local" });

const productsToSeed = [
  { name: "DJI Air 3S Fly More Combo (DJI RC 2)", slug: "air-3s-fly-more-combo-rc2", price: 5880000, categoryName: "Drone", shortDescription: "Double-Lens 2.0. Night Imagery, Travel Safety.", tags: ["Air 3s", "Combo", "RC2"] },
  { name: "DJI Air 3S Fly More Combo (DJI RC-N3)", slug: "air-3s-fly-more-combo-rcn3", price: 5080000, categoryName: "Drone", shortDescription: "Dual-camera drone for enthusiasts.", tags: ["Air 3s", "Combo", "RC-N3"] },
  { name: "DJI Avata 360 (DJI RC 2)", slug: "avata-360-rc2", price: 2680000, categoryName: "Drone", shortDescription: "Immersive Flight Experience.", tags: ["Avata", "FPV"] },
  { name: "DJI Avata 360 Fly More Combo (DJI RC 2)", slug: "avata-360-combo-rc2", price: 3280000, categoryName: "Drone", shortDescription: "Full immersive experience with accessories.", tags: ["Avata", "Combo"] },
  { name: "DJI Avata 360 Motion Fly More Combo (DJI Goggles N3)", slug: "avata-360-motion-combo", price: 3280000, categoryName: "Drone", shortDescription: "Intuitive motion control flight.", tags: ["Avata", "Motion", "Goggles N3"] },
  { name: "DJI Mini 5 Pro Fly More Combo (DJI RC 2) PLUS", slug: "mini-5-pro-combo-plus", price: 4380000, categoryName: "Drone", shortDescription: "Peak performance under 249g.", tags: ["Mini 5 Pro", "Plus", "Combo"] },
  { name: "DJI Mini 5 Pro Fly More Combo (DJI RC 2)", slug: "mini-5-pro-combo", price: 4080000, categoryName: "Drone", shortDescription: "Smartest mini drone yet.", tags: ["Mini 5 Pro", "Combo"] },
  { name: "DJI Mavic 4 Pro Fly More Combo (DJI RC 2)", slug: "mavic-4-pro-combo", price: 9580000, categoryName: "Drone", shortDescription: "Next-gen flagship camera drone.", tags: ["Mavic 4 Pro", "Combo"] },
  { name: "DJI Mavic 4 Pro Fly More Combo (DJI RC Pro 2)", slug: "mavic-4-pro-pro-combo", price: 12280000, categoryName: "Drone", shortDescription: "Professional grade aerial imaging.", tags: ["Mavic 4 Pro", "Pro Combo"] },
  { name: "DJI Z Flip (DJI RC 2)", slug: "z-flip-rc2", price: 2280000, categoryName: "Drone", shortDescription: "Foldable compact selfie drone.", tags: ["Z Flip", "Portable"] },
  { name: "DJI Z Flip Fly More Combo (DJI RC 2)", slug: "z-flip-combo", price: 2980000, categoryName: "Drone", shortDescription: "Compact convenience with more flight time.", tags: ["Z Flip", "Combo"] },
  { name: "DJI Neo 2 Fly More Combo", slug: "neo-2-combo", price: 1480000, categoryName: "Drone", shortDescription: "Simplest palm takeoff drone.", tags: ["Neo 2", "Combo"] },
  { name: "DJI Neo 2 Motion Fly More Combo", slug: "neo-2-motion-combo", price: 2180000, categoryName: "Drone", shortDescription: "Motion controlled palm drone.", tags: ["Neo 2", "Motion"] },
  { name: "Potensic Atom 2 Fly More Combo (Standard RC)", slug: "potensic-atom-2-standard", price: 1850000, categoryName: "Drone", shortDescription: "Ultra-light 4K GPS drone.", tags: ["Potensic", "Atom 2"] },
  { name: "Potensic Atom 2 Fly More Combo (RC PTD 1)", slug: "potensic-atom-2-ptd", price: 2450000, categoryName: "Drone", shortDescription: "Enhanced Potensic flight experience.", tags: ["Potensic", "Atom 2"] },
  { name: "Osmo Pocket 3", slug: "osmo-pocket-3", price: 1520000, categoryName: "Handheld", shortDescription: "1-inch CMOS Pocket Gimbal Camera.", tags: ["Pocket 3", "Camera"] },
  { name: "Osmo Pocket 3 Creator Combo", slug: "osmo-pocket-3-creator-combo", price: 1980000, categoryName: "Handheld", shortDescription: "Full creator toolkit for Pocket 3.", tags: ["Pocket 3", "Combo"] },
  { name: "DJI Mic Mini (1TX + 1RX)", slug: "mic-mini-1-1", price: 168000, categoryName: "Handheld", shortDescription: "Ultra-compact wireless microphone.", tags: ["Mic Mini", "Audio"] },
  { name: "DJI Mic Mini (2TX + 1RX)", slug: "mic-mini-2-1", price: 328000, categoryName: "Handheld", shortDescription: "Dual-channel compact audio.", tags: ["Mic Mini", "Audio"] },
  { name: "DJI Osmo Mobile 7 Plus", slug: "osmo-mobile-7-plus", price: 468000, categoryName: "Handheld", shortDescription: "Advanced smartphone gimbal.", tags: ["OM7", "Gimbal"] },
  { name: "DJI Osmo Mobile 8", slug: "osmo-mobile-8", price: 528000, categoryName: "Handheld", shortDescription: "Next-gen mobile stabilization.", tags: ["OM8", "Gimbal"] },
  { name: "DJI RS Mini", slug: "rs-mini", price: 1108000, categoryName: "Handheld", shortDescription: "Lightweight professional stabilizer.", tags: ["RS Mini", "Ronin"] },
  { name: "DJI RS Mini Combo", slug: "rs-mini-combo", price: 1380000, categoryName: "Handheld", shortDescription: "Full RS Mini features.", tags: ["RS Mini", "Combo"] },
  { name: "DJI Osmo 360 Standard Combo", slug: "osmo-360-standard", price: 1758000, categoryName: "Handheld", shortDescription: "360-degree action capture.", tags: ["Osmo 360", "Action"] },
  { name: "DJI Osmo 360 Adventure Combo", slug: "osmo-360-adventure", price: 2180000, categoryName: "Handheld", shortDescription: "All-weather action toolkit.", tags: ["Osmo 360", "Adventure"] },
  { name: "DJI Mic 3 (2TX+1RX+charging case)", slug: "mic-3-2-1-case", price: 1258000, categoryName: "Handheld", shortDescription: "Professional wireless audio.", tags: ["Mic 3", "Audio"] },
  { name: "DJI Osmo Nano 128Gb", slug: "osmo-nano-128gb", price: 1280000, categoryName: "Handheld", shortDescription: "Ultra-mini action camera.", tags: ["Osmo Nano", "Camera"] },
  { name: "DJI Mic 3 (1TX + 1RX)", slug: "mic-3-1-1", price: 728000, categoryName: "Handheld", shortDescription: "Single channel Mic 3 setup.", tags: ["Mic 3", "Audio"] },
  { name: "DJI RS 5 Combo", slug: "rs-5-combo", price: 2280000, categoryName: "Handheld", shortDescription: "Evolution of stabilization.", tags: ["RS 5", "Ronin"] },
  { name: "StartRC Waterproof Hard Case (Air 3S)", slug: "startrc-case-air-3s", price: 149000, categoryName: "Accessories", shortDescription: "Rugged protection for Air 3S.", tags: ["StartRC", "Case"] },
  { name: "StartRC Waterproof Hard Case (Mini 5 Pro)", slug: "startrc-case-mini-5-pro", price: 119000, categoryName: "Accessories", shortDescription: "Compact hard case for Mini 5 Pro.", tags: ["StartRC", "Case"] },
  { name: "StartRC Waterproof Hard Case (MT4 Pro)", slug: "startrc-case-mavic-4", price: 179000, categoryName: "Accessories", shortDescription: "Tough case for Mavic 4 Pro.", tags: ["StartRC", "Case"] }
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kwriuxevzrvxuwujsgmh.supabase.co';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cml1eGV2enJ2eHV3dWpzZ21oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU5NTc5NywiZXhwIjoyMDkwMTcxNzk3fQ.QusmVbS0CYIWKH_iHjdYz1WThiJVTfCTFBlaW_HGdUo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("Starting seed with absolute config path...");
  console.log("Using URL:", supabaseUrl);
  
  const categoriesMap: Record<string, string> = {};
  const categoriesToUpsert = [
    { name: "Drone", slug: "drones" },
    { name: "Handheld", slug: "handheld" },
    { name: "Accessories", slug: "accessories" }
  ];

  for (const cat of categoriesToUpsert) {
    const { data: catData, error: catError } = await supabase.from("categories").select("id").eq("slug", cat.slug).single();
    if (catData) {
      categoriesMap[cat.name] = catData.id;
    } else {
      const { data: newCat, error: insertError } = await supabase.from("categories").insert(cat).select().single();
      if (newCat) {
        categoriesMap[cat.name] = newCat.id;
        console.log(`+ Created category: ${cat.name}`);
      } else {
        console.error(`! Category error: ${cat.name}`, insertError?.message);
      }
    }
  }

  for (const product of productsToSeed) {
    const categoryId = categoriesMap[product.categoryName];
    if (!categoryId) {
      console.error(`! No category ID for ${product.name}`);
      continue;
    }

    const { data: existing } = await supabase.from("products").select("id").eq("slug", product.slug).single();
    if (existing) {
      console.log(`~ Exists: ${product.name}`);
      continue;
    }

    const { data: newP, error: pErr } = await supabase.from("products").insert({
      name: product.name, 
      slug: product.slug, 
      price: product.price,
      brand: product.name.includes("START") || product.name.includes("Start") ? "StartRC" : (product.name.includes("Potensic") ? "Potensic" : "DJI"),
      short_description: product.shortDescription, 
      category_id: categoryId, 
      is_leasable: true
    }).select().single();

    if (newP) {
      console.log(`+ ${product.name}`);
      await supabase.from("product_images").insert({
        product_id: newP.id, 
        url: "https://p-f6-official-sg.djicdn.com/gray-static/static/images/product/mavic-3-pro/banner.jpg",
        alt: product.name, 
        display_order: 0
      });
    } else {
      console.error(`! Product error ${product.name}:`, pErr?.message);
    }
  }
  console.log("Seeding process finished.");
}
seed();
