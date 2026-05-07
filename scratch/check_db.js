const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kwriuxevzrvxuwujsgmh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cml1eGV2enJ2eHV3dWpzZ21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1OTU3OTcsImV4cCI6MjA5MDE3MTc5N30.SmJnuJleYhzkeNnTQuFOOpo_cCH8JONWk_WPsy8m3aI'; // Anon key from .env

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking categories...');
  const { data: categories, error: catError } = await supabase.from('categories').select('*');
  console.log('Categories:', categories);
  if (catError) console.error('Cat Error:', catError);

  console.log('\nChecking products count...');
  const { count, error: prodError } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log('Total products count:', count);
  if (prodError) console.error('Prod Error:', prodError);

  console.log('\nChecking products with category drones...');
  const { data: droneCat } = await supabase.from('categories').select('id').eq('slug', 'drones').single();
  if (droneCat) {
    const { data: drones, error: droneError } = await supabase.from('products').select('id, name').eq('category_id', droneCat.id);
    console.log('Drones found:', drones?.length);
    if (droneError) console.error('Drone Error:', droneError);
  } else {
    console.log('Category "drones" not found!');
  }
}

check();
