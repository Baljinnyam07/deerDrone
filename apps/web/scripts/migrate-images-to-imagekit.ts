import { createClient } from '@supabase/supabase-js';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY!; // Updated to match .env.local
const ikPublicKey = process.env.IMAGEKIT_PUBLIC_KEY!;
const ikPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY!;
const ikUrlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT!;

if (!supabaseUrl || !supabaseKey || !ikPublicKey || !ikPrivateKey || !ikUrlEndpoint) {
  console.error("Missing credentials in .env file. Please ensure you have:");
  console.error("- NEXT_PUBLIC_SUPABASE_URL");
  console.error("- SUPABASE_SERVICE_ROLE_KEY");
  console.error("- IMAGEKIT_PUBLIC_KEY");
  console.error("- IMAGEKIT_PRIVATE_KEY");
  console.error("- IMAGEKIT_URL_ENDPOINT");
  process.exit(1);
}

// --- CONFIGURATION ---
const DRY_RUN = false; // Set to false when you are ready to actually delete and update!
const FOLDER_NAME = '/products/'; // Target folder in ImageKit
// ---------------------

const supabase = createClient(supabaseUrl, supabaseKey);
const imagekit = new ImageKit({
  publicKey: ikPublicKey,
  privateKey: ikPrivateKey,
  urlEndpoint: ikUrlEndpoint,
});

async function migrateImages() {
  console.log(`🚀 Starting image migration to ImageKit... (DRY_RUN: ${DRY_RUN})`);

  const { data: images, error } = await supabase
    .from('product_images')
    .select('id, url, product_id');

  if (error) {
    console.error("❌ Error fetching images from Supabase:", error);
    return;
  }

  console.log(`📦 Found ${images.length} images in database.`);

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (const image of images) {
    if (image.url.includes('ik.imagekit.io')) {
      console.log(`⏩ Skipping (Already on ImageKit): ID ${image.id}`);
      skipCount++;
      continue;
    }

    try {
      console.log(`\n📸 Processing Image ID: ${image.id} (Product: ${image.product_id})`);
      console.log(`   Original URL: ${image.url}`);

      // Parse Supabase info if applicable
      let supabasePath: string | null = null;
      let bucketName: string | null = null;

      if (image.url.includes('storage.googleapis.com') || image.url.includes('supabase.co/storage/v1/object/public/')) {
        const parts = image.url.split('/public/');
        if (parts.length > 1) {
          const pathParts = parts[1].split('/');
          bucketName = pathParts[0];
          supabasePath = pathParts.slice(1).join('/');
          console.log(`   Detected Supabase File: Bucket [${bucketName}], Path [${supabasePath}]`);
        }
      }

      if (DRY_RUN) {
        console.log(`   [DRY RUN] Would upload to ImageKit as: product_${image.product_id}_${image.id}`);
        console.log(`   [DRY RUN] Would update Supabase DB for ID ${image.id}`);
        if (bucketName && supabasePath) {
          console.log(`   [DRY RUN] Would delete from Supabase Storage: ${bucketName}/${supabasePath}`);
        }
        successCount++;
        continue;
      }

      // --- ACTUAL MIGRATION STEPS ---

      // 1. Upload to ImageKit
      const uploadResponse = await imagekit.upload({
        file: image.url, 
        fileName: `product_${image.product_id}_${image.id}`,
        folder: FOLDER_NAME,
        useUniqueFileName: true,
      });

      if (!uploadResponse.url) throw new Error("ImageKit upload failed - no URL returned.");
      console.log(`   ✅ Step 1: Uploaded to ImageKit -> ${uploadResponse.url}`);

      // 2. Update Supabase DB
      const { error: updateError } = await supabase
        .from('product_images')
        .update({ url: uploadResponse.url })
        .eq('id', image.id);

      if (updateError) {
        // If DB update fails, we should NOT delete the original file.
        throw new Error(`Supabase DB update failed: ${updateError.message}`);
      }
      console.log(`   ✅ Step 2: Supabase database updated.`);

      // 3. Delete from Supabase Storage (Cleanup)
      if (bucketName && supabasePath) {
        const { error: deleteError } = await supabase.storage.from(bucketName).remove([supabasePath]);
        if (deleteError) {
          console.error(`   ⚠️ Step 3 Warning: Failed to delete original file from storage: ${deleteError.message}`);
        } else {
          console.log(`   ✅ Step 3: Original file deleted from Supabase Storage.`);
        }
      }

      successCount++;

    } catch (err: any) {
      failCount++;
      console.error(`   ❌ Failed: ${err.message}`);
    }
  }

  console.log(`\n🏁 Migration Finished!`);
  console.log(`------------------------------`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed:  ${failCount}`);
  console.log(`⏩ Skipped: ${skipCount}`);
  console.log(`------------------------------`);
  if (DRY_RUN) console.log("⚠️ This was a DRY RUN. No changes were made to your database or storage.");
}

migrateImages();
