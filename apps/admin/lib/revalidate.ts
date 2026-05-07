export async function revalidateTag(tag: string) {
  const secret = process.env.REVALIDATE_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

  if (!secret || !siteUrl) {
    console.warn("REVALIDATE_SECRET or SITE_URL missing in Admin Environment, skipping revalidation");
    return;
  }

  // Ensure URL doesn't end with / to avoid //api/revalidate
  const cleanUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const endpoint = `${cleanUrl}/api/revalidate?secret=${secret}&tag=${tag}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    if (!res.ok) {
      console.error(`Revalidation failed for tag ${tag}:`, data);
    } else {
      console.log(`Revalidation successful for tag ${tag}:`, data);
    }
  } catch (err: any) {
    console.error(`Revalidation fetch error for tag ${tag}:`, err?.message || err);
  }
}
