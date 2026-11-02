/**
 * Shape of the rich product page content stored in `product_media`.
 * Mirrors apps/web/lib/product-media.ts (the storefront renders it).
 */

const CLOUD_BASE = "https://res.cloudinary.com/dx3ymrxfs/image/upload";

export interface MediaImage {
  id: string;
  alt: string;
  caption?: string;
}

export interface MediaChapter {
  title: string;
  text: string;
  images: MediaImage[];
  natural?: boolean;
}

export interface ProductMedia {
  folder: string;
  hero: MediaImage;
  heroVideo?: { id: string; poster: string };
  heroYoutube?: boolean;
  heroTitle?: string;
  heroDark?: boolean;
  film?: string;
  youtube?: string;
  chapters: MediaChapter[];
  galleryTitle: string;
  gallery: MediaImage[];
}

/** Preview URL for an image: uploaded images are absolute URLs, built-in ones are Cloudinary ids. */
export function mediaPreviewUrl(folder: string, id: string, width = 600): string {
  if (!id) return "";
  if (/^https?:\/\//i.test(id)) return id;
  return `${CLOUD_BASE}/f_auto,q_auto,w_${width}/deerdrone/${folder}/${id}`;
}

/** Accepts a YouTube link or an 11-character id and returns the id ("" when invalid). */
export function parseYoutubeId(input: string): string {
  const value = input.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  const match = value.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1] : "";
}

const text = (v: unknown, max: number): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

function sanitizeImage(raw: unknown): MediaImage | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = text(r.id, 1000);
  // Either an absolute URL (admin upload) or a plain Cloudinary public id.
  if (!id || !(/^https?:\/\//i.test(id) || /^[\w./-]+$/.test(id))) return null;
  const caption = text(r.caption, 200);
  return { id, alt: text(r.alt, 300), ...(caption ? { caption } : {}) };
}

/** Cleans editor input before it is stored; null when the page has no hero image. */
export function sanitizeProductMedia(raw: unknown): ProductMedia | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const hero = sanitizeImage(r.hero);
  if (!hero) return null;

  const images = (list: unknown): MediaImage[] =>
    Array.isArray(list)
      ? list.map(sanitizeImage).filter((i): i is MediaImage => !!i).slice(0, 12)
      : [];

  const chapters: MediaChapter[] = (Array.isArray(r.chapters) ? r.chapters : [])
    .slice(0, 30)
    .map((c): MediaChapter | null => {
      if (!c || typeof c !== "object") return null;
      const ch = c as Record<string, unknown>;
      const chapterImages = images(ch.images);
      const title = text(ch.title, 200);
      if (!title && chapterImages.length === 0) return null;
      return {
        title,
        text: text(ch.text, 2000),
        images: chapterImages,
        ...(ch.natural === true ? { natural: true } : {}),
      };
    })
    .filter((c): c is MediaChapter => !!c);

  const youtube = parseYoutubeId(text(r.youtube, 200));
  const heroVideo = r.heroVideo as { id?: unknown; poster?: unknown } | undefined;
  const videoId = heroVideo ? text(heroVideo.id, 1000) : "";
  const posterId = heroVideo ? text(heroVideo.poster, 1000) : "";

  return {
    folder: text(r.folder, 80),
    hero,
    ...(videoId && posterId ? { heroVideo: { id: videoId, poster: posterId } } : {}),
    ...(text(r.film, 120) ? { film: text(r.film, 120) } : {}),
    ...(youtube ? { youtube } : {}),
    ...(r.heroYoutube === true && youtube ? { heroYoutube: true } : {}),
    ...(text(r.heroTitle, 120) ? { heroTitle: text(r.heroTitle, 120) } : {}),
    ...(r.heroDark === true ? { heroDark: true } : {}),
    chapters,
    galleryTitle: text(r.galleryTitle, 200),
    gallery: images(r.gallery),
  };
}
