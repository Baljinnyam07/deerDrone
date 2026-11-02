/** Uploads one image to ImageKit with a server-signed token and returns its public URL. */
export async function uploadImage(file: File, folder = "/products/"): Promise<string> {
  const authRes = await fetch("/api/imagekit/auth");
  if (!authRes.ok) throw new Error("ImageKit auth failed");
  const authParams = await authRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
  formData.append("signature", authParams.signature);
  formData.append("expire", authParams.expire.toString());
  formData.append("token", authParams.token);
  formData.append("folder", folder);

  const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json().catch(() => ({}));
    throw new Error(errorData.message || "ImageKit upload failed");
  }

  const data = await uploadRes.json();
  return data.url as string;
}
