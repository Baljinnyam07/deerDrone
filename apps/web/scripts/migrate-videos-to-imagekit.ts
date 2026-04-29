import { createClient } from '@supabase/supabase-js';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY!;
const ikPublicKey = process.env.IMAGEKIT_PUBLIC_KEY!;
const ikPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY!;
const ikUrlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT!;

if (!supabaseUrl || !supabaseKey || !ikPublicKey || !ikPrivateKey || !ikUrlEndpoint) {
  console.error("Missing credentials in .env.local.");
  process.exit(1);
}

// --- CONFIGURATION ---
const DRY_RUN = false; // Set to false when ready!
const FOLDER_NAME = '/videos/';
// ---------------------

const supabase = createClient(supabaseUrl, supabaseKey);
const imagekit = new ImageKit({
  publicKey: ikPublicKey,
  privateKey: ikPrivateKey,
  urlEndpoint: ikUrlEndpoint,
});

async function migrateVideos() {
  console.log(`🚀 Starting video migration to ImageKit... (DRY_RUN: ${DRY_RUN})`);

  // Fetch all videos from site_settings (assuming videos have .mp4 in value)
  const { data: settings, error } = await supabase
    .from('site_settings')
    .select('*')
    .ilike('value', '%.mp4%');

  if (error) {
    console.error("❌ Error fetching settings:", error);
    return;
  }

  console.log(`📦 Found ${settings.length} videos to process.`);

  for (const setting of settings) {
    if (setting.value.includes('ik.imagekit.io')) {
      console.log(`⏩ Skipping (Already on ImageKit): Key [${setting.key}]`);
      continue;
    }

    try {
      console.log(`\n🎬 Processing Video: ${setting.key}`);
      console.log(`   URL: ${setting.value}`);

      // Extract Supabase Storage info
      let supabasePath: string | null = null;
      let bucketName: string | null = null;

      if (setting.value.includes('supabase.co/storage/v1/object/public/')) {
        const parts = setting.value.split('/public/');
        if (parts.length > 1) {
          const pathParts = parts[1].split('/');
          bucketName = pathParts[0];
          supabasePath = pathParts.slice(1).join('/');
        }
      }

      if (DRY_RUN) {
        console.log(`   [DRY RUN] Would upload to ImageKit as: video_${setting.key}`);
        console.log(`   [DRY RUN] Would update site_settings for key ${setting.key}`);
        if (bucketName && supabasePath) {
          console.log(`   [DRY RUN] Would delete from Supabase Storage: ${bucketName}/${supabasePath}`);
        }
        continue;
      }

      // --- ACTUAL MIGRATION ---

      // 1. Upload to ImageKit
      console.log(`   Uploading to ImageKit... (this may take a while for large videos)`);
      const uploadResponse = await imagekit.upload({
        file: setting.value,
        fileName: `video_${setting.key}_${Date.now()}`,
        folder: FOLDER_NAME,
        useUniqueFileName: true,
      });

      console.log(`   ✅ Step 1: Uploaded to ImageKit -> ${uploadResponse.url}`);

      // 2. Update site_settings
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ value: uploadResponse.url })
        .eq('key', setting.key);

      if (updateError) throw new Error(`DB update failed: ${updateError.message}`);
      console.log(`   ✅ Step 2: Database updated.`);

      // 3. Cleanup Storage
      if (bucketName && supabasePath) {
        const { error: deleteError } = await supabase.storage.from(bucketName).remove([supabasePath]);
        if (deleteError) {
          console.error(`   ⚠️ Step 3 Warning: Failed to delete from storage: ${deleteError.message}`);
        } else {
          console.log(`   ✅ Step 3: Original file deleted from Supabase Storage.`);
        }
      }

    } catch (err: any) {
      console.error(`   ❌ Failed to process ${setting.key}: ${err.message}`);
    }
  }

  console.log(`\n🏁 Video Migration Finished!`);
}

migrateVideos();
