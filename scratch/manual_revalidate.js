const secret = 'dd_reval_98f2e51a67b4c803d21e';
const siteUrl = 'https://deerdrone.mn';

async function revalidate() {
  const tags = ['products', 'categories', 'brands', 'settings'];
  for (const tag of tags) {
    console.log(`Revalidating tag: ${tag}...`);
    try {
      const res = await fetch(`${siteUrl}/api/revalidate?secret=${secret}&tag=${tag}`);
      const data = await res.json();
      console.log(`Result for ${tag}:`, data);
    } catch (err) {
      console.error(`Error for ${tag}:`, err.message);
    }
  }
}

revalidate();
