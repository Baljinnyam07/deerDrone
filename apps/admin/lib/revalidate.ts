export async function revalidateTag(tag: string) {
  const secret = process.env.REVALIDATE_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

  if (!secret || !siteUrl) {
    return { 
      success: false, 
      message: "Missing environment variables", 
      hasSecret: !!secret, 
      hasSiteUrl: !!siteUrl 
    };
  }

  const cleanUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const endpoint = `${cleanUrl}/api/revalidate?secret=${secret}&tag=${tag}`;

  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    return { 
      success: res.ok, 
      status: res.status, 
      data 
    };
  } catch (err: any) {
    return { 
      success: false, 
      message: err?.message || "Fetch error" 
    };
  }
}
