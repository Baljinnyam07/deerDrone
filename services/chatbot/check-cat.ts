import { supabase } from './src/tools/catalog.js';

async function test() {
  const { data: allInCat } = await supabase
    .from('products')
    .select('name, category_id, categories(name)')
    .eq('category_id', '226a75bd-6dfc-4619-9331-35ac02b19900')
    .order('created_at', { ascending: false })
    .limit(10);
  
  console.log('Drones:', allInCat);
}

test().catch(console.error).finally(() => process.exit(0));
