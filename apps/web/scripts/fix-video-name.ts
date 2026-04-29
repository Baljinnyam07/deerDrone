import ImageKit from 'imagekit';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const ik = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
);

async function fix() {
  console.log("🔍 Searching for the video in ImageKit...");
  
  try {
    // 1. Find the file
    const files = await ik.listFiles({
      name: 'video_home_showcase_side_1777461724060_rSn2iFL1c',
    });

    if (files.length === 0) {
      console.log("❌ File not found in ImageKit.");
      return;
    }

    const file = files[0] as any;
    console.log(`✅ Found file: ${file.name} (ID: ${file.fileId})`);

    // 2. ImageKit doesn't allow renaming a file directly via updateFileDetails in some versions,
    // but we can move it to a new path (rename) using bulkMoveFiles or similar.
    // Or we can just re-upload it from its own URL but with a correct name!
    
    console.log("⏳ Re-uploading with correct extension...");
    const uploadRes = await ik.upload({
      file: file.url, // Source is the current ImageKit URL
      fileName: file.name + ".mp4",
      folder: '/videos/',
      useUniqueFileName: false, // Keep it simple
    });

    console.log(`✅ Successfully re-uploaded as: ${uploadRes.url}`);

    // 3. Update Supabase
    console.log("⏳ Updating Supabase...");
    const { error } = await supabase
      .from('site_settings')
      .update({ value: uploadRes.url })
      .eq('key', 'home_showcase_side');

    if (error) throw error;
    console.log("✅ Supabase updated.");

    // 4. Delete the old file
    console.log("⏳ Deleting old file without extension...");
    await ik.deleteFile(file.fileId);
    console.log("✅ Old file deleted.");

    console.log("\n✨ ALL DONE! Please check the website now.");

  } catch (err: any) {
    console.error("❌ Error:", err.message);
  }
}

fix();
