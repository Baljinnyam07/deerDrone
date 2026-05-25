const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('Updating video links in site_settings...');

  // 1. Update home_hero video
  const { data: heroData, error: heroError } = await supabase
    .from('site_settings')
    .update({ value: 'https://pub-d35869f82a8446f7ae9101d79069e8b1.r2.dev/M77_WA150_30s_EN_1920x1080.mp4' })
    .eq('key', 'home_hero')
    .select();

  if (heroError) {
    console.error('Error updating home_hero:', heroError);
  } else {
    console.log('Successfully updated home_hero:', heroData);
  }

  // 2. Update home_showcase_side (bosoo) video
  const { data: sideData, error: sideError } = await supabase
    .from('site_settings')
    .update({ value: 'https://pub-d35869f82a8446f7ae9101d79069e8b1.r2.dev/M17_WA020_30s_EN_1080x1920.mp4' })
    .eq('key', 'home_showcase_side')
    .select();

  if (sideError) {
    console.error('Error updating home_showcase_side:', sideError);
  } else {
    console.log('Successfully updated home_showcase_side:', sideData);
  }
}

main();
