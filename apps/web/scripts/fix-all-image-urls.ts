import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
);

async function fixImageUrls() {
  console.log("🔍 Checking all product images for missing extensions...");
  
  const { data: images, error } = await supabase
    .from('product_images')
    .select('*');

  if (error) {
    console.error("❌ Error fetching images:", error);
    return;
  }

  let count = 0;
  for (const img of images) {
    // Check if it's an ImageKit URL and lacks an extension in the last segment
    const urlParts = img.url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    
    if (img.url.includes('ik.imagekit.io') && !lastPart.includes('.')) {
      const newUrl = img.url + '.png'; // Using .png as a safe fallback
      
      const { error: updateError } = await supabase
        .from('product_images')
        .update({ url: newUrl })
        .eq('id', img.id);

      if (updateError) {
        console.error(`❌ Failed to update image ${img.id}:`, updateError.message);
      } else {
        count++;
      }
    }
  }

  console.log(`\n✨ Fixed ${count} image URLs. Please refresh the website now.`);
}

fixImageUrls();
