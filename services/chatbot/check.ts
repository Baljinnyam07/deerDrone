import { matchProducts, getMinimalCatalogContext } from './src/productMatcher.js';

async function test() {
  console.log('Testing...');
  const res1 = await matchProducts('Мэргэжлийн зураг авдаг дрон сонирхож байна.');
  console.log('Match Products:', JSON.stringify(res1, null, 2));

  const res2 = await getMinimalCatalogContext(8);
  console.log('Minimal Context:', JSON.stringify(res2, null, 2));
}

test().catch(console.error).finally(() => process.exit(0));
