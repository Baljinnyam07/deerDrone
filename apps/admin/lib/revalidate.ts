export async function revalidateTag(tag: string) {
  const secret = process.env.REVALIDATE_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!secret || !siteUrl) {
    console.warn("REVALIDATE_SECRET or NEXT_PUBLIC_SITE_URL missing, skipping revalidation");
    return;
  }

  try {
    const res = await fetch(`${siteUrl}/api/revalidate?secret=${secret}&tag=${tag}`);
    if (!res.ok) {
      console.error(`Revalidation failed for tag ${tag}:`, await res.text());
    } else {
      console.log(`Revalidation successful for tag ${tag}`);
    }
  } catch (err) {
    console.error(`Revalidation fetch error for tag ${tag}:`, err);
  }
}
