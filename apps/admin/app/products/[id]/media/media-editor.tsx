"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ImagePlus,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { AdminButton } from "@/components/ui/admin-button";
import { useToast } from "@/components/ui/toast";
import {
  mediaPreviewUrl,
  parseYoutubeId,
  type MediaChapter,
  type MediaImage,
  type ProductMedia,
} from "@/lib/product-media";
import { uploadImage } from "@/lib/upload-image";

type Source = "custom" | "builtin" | "empty";

function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

const SOURCE_NOTE: Record<Source, string> = {
  custom: "Энэ хуудас админаас хадгалсан агуулгаар харагдаж байна.",
  builtin: "Энэ хуудас одоогоор сайтын анхны тохиргоогоор харагдаж байна. Хадгалах үед админы агуулга болж солигдоно.",
  empty: "Энэ бараанд дэлгэрэнгүй хуудас үүсээгүй байна. Гол зургаа оруулаад хадгалбал хуудас үүснэ.",
};

export function MediaEditor({
  slug,
  siteUrl,
  initial,
  source,
}: {
  slug: string;
  siteUrl: string;
  initial: ProductMedia;
  source: Source;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [media, setMedia] = useState<ProductMedia>(initial);
  const [youtubeInput, setYoutubeInput] = useState(initial.youtube ?? "");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [current, setCurrent] = useState<Source>(source);

  const patch = (next: Partial<ProductMedia>) => {
    setMedia((m) => ({ ...m, ...next }));
    setDirty(true);
  };

  const patchChapter = (index: number, next: Partial<MediaChapter>) =>
    patch({ chapters: media.chapters.map((c, i) => (i === index ? { ...c, ...next } : c)) });

  const youtubeId = parseYoutubeId(youtubeInput);

  async function save() {
    if (!media.hero.id) {
      toast("Эхлээд гол (hero) зургаа оруулна уу.", "error");
      return;
    }
    if (youtubeInput.trim() && !youtubeId) {
      toast("YouTube холбоос буруу байна.", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/product-media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          data: {
            ...media,
            youtube: youtubeId,
            // An uploaded clip uses the current hero image as its poster.
            heroVideo:
              media.heroVideo && /^https?:\/\//i.test(media.heroVideo.id)
                ? { id: media.heroVideo.id, poster: media.hero.id }
                : media.heroVideo,
          },
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Хадгалж чадсангүй.");
      toast("Хадгаллаа. Сайт дээр удахгүй шинэчлэгдэнэ.", "success");
      setDirty(false);
      setCurrent("custom");
      router.refresh();
    } catch (err: any) {
      toast(err.message || "Хадгалж чадсангүй.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!confirm("Админаас хадгалсан агуулгыг устгаад, сайтын анхны хуудас руу буцаах уу?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/product-media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Сэргээж чадсангүй.");
      toast("Анхны хуудас руу буцлаа.", "success");
      router.refresh();
      window.location.reload();
    } catch (err: any) {
      toast(err.message || "Сэргээж чадсангүй.", "error");
      setSaving(false);
    }
  }

  return (
    <div className="media-editor">
      <p className="media-note">{SOURCE_NOTE[current]}</p>

      <div className="media-steps">
        <strong>Хэрхэн засах вэ?</strong>
        <ol>
          <li><b>Гол хэсэг</b>: хуудасны хамгийн дээд том зураг, гарчиг, видео.</li>
          <li><b>Онцлох хэсгүүд</b>: доош гүйлгэхэд гарах гарчиг, тайлбар, зурагтай блокууд.</li>
          <li><b>Зургийн цомог</b>: хуудасны төгсгөлийн зургууд (заавал биш).</li>
          <li>Дараа нь доорх <b>Хадгалах</b> товчийг дарна. Сайт дээр шууд шинэчлэгдэнэ.</li>
        </ol>
      </div>

      {/* Hero */}
      <article className="admin-panel">
        <div className="admin-panel-header">
          <h2>1. Гол хэсэг</h2>
        </div>
        <p className="media-hint">Хуудас нээгдэхэд хамгийн түрүүнд харагдах том зураг, гарчиг, видео.</p>
        <div className="media-grid">
          <div className="media-field">
            <label>Том гарчиг</label>
            <input
              type="text"
              value={media.heroTitle ?? ""}
              onChange={(e) => patch({ heroTitle: e.target.value })}
              placeholder="Хоосон бол барааны нэр гарна"
            />
            <span className="media-hint">Барааны нэр урт бол энд богино нэр бичнэ.</span>
            <label>Дээд хэсгийн видео файл (заавал биш)</label>
            <VideoSlot
              video={media.heroVideo?.id ?? ""}
              onChange={(id) =>
                patch({ heroVideo: id ? { id, poster: media.hero.id } : undefined })
              }
            />
            <span className="media-hint">
              MP4 файл, 25MB-аас бага. Зураг ачаалагдтал гол зураг түр харагдана. Видео байвал YouTube-ээс түрүүлж тоглоно.
            </span>
            <label>YouTube видео (заавал биш)</label>
            <input
              type="text"
              value={youtubeInput}
              onChange={(e) => {
                setYoutubeInput(e.target.value);
                setDirty(true);
              }}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {youtubeInput.trim() && !youtubeId && <span className="media-warn">Холбоос танигдсангүй</span>}
            <label className="media-check">
              <input
                type="checkbox"
                checked={!!media.heroYoutube}
                disabled={!youtubeId}
                onChange={(e) => patch({ heroYoutube: e.target.checked })}
              />
              Дээд хэсгийн арын дэвсгэрт видеог дуугүй, давтаж тоглуулах
            </label>
            <span className="media-hint">Видеог "Видео үзэх" товчоор бүтнээр нь үргэлж үзэж болно.</span>
            <label className="media-check">
              <input
                type="checkbox"
                checked={!!media.heroDark}
                onChange={(e) => patch({ heroDark: e.target.checked })}
              />
              Зураг харанхуй бол бичгийг цагаан болгох
            </label>
          </div>
          <ImageSlot
            label="Дээд хэсгийн зураг"
            folder={media.folder}
            image={media.hero}
            onChange={(hero) => patch({ hero })}
            required
          />
        </div>
      </article>

      {/* Chapters */}
      <article className="admin-panel">
        <div className="admin-panel-header">
          <h2>2. Онцлох хэсгүүд</h2>
        </div>
        <p className="media-hint">Хэсэг бүр = нэг гарчиг + богино тайлбар + 1–4 зураг. Дарааллыг сумаар солино.</p>
        <div className="media-chapters">
          {media.chapters.map((chapter, index) => (
            <div className="media-chapter" key={index}>
              <div className="media-chapter-head">
                <strong>Хэсэг {index + 1}{chapter.title ? ` · ${chapter.title}` : ""}</strong>
                <div className="media-row-actions">
                  <button type="button" title="Дээш" disabled={index === 0} onClick={() => patch({ chapters: move(media.chapters, index, -1) })}>
                    <ArrowUp size={15} />
                  </button>
                  <button type="button" title="Доош" disabled={index === media.chapters.length - 1} onClick={() => patch({ chapters: move(media.chapters, index, 1) })}>
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    title="Устгах"
                    className="danger"
                    onClick={() => patch({ chapters: media.chapters.filter((_, i) => i !== index) })}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={chapter.title}
                onChange={(e) => patchChapter(index, { title: e.target.value })}
                placeholder="Гарчиг (жишээ: 16км дамжуулалт)"
              />
              <textarea
                rows={3}
                value={chapter.text}
                onChange={(e) => patchChapter(index, { text: e.target.value })}
                placeholder="Тайлбар текст: 1–2 өгүүлбэр"
              />
              <label className="media-check">
                <input
                  type="checkbox"
                  checked={!!chapter.natural}
                  onChange={(e) => patchChapter(index, { natural: e.target.checked })}
                />
                Зургийг таслахгүй бүтнээр харуулах
              </label>
              <span className="media-hint">Зурган дээр бичиг байвал энийг сонгоно, эс бөгөөс зургийн ирмэг тайрагдаж болно.</span>
              <ImageList
                folder={media.folder}
                images={chapter.images}
                max={4}
                onChange={(images) => patchChapter(index, { images })}
              />
            </div>
          ))}
          <AdminButton
            type="button"
            variant="secondary"
            icon={Plus}
            onClick={() => patch({ chapters: [...media.chapters, { title: "", text: "", images: [] }] })}
          >
            Хэсэг нэмэх
          </AdminButton>
        </div>
      </article>

      {/* Gallery */}
      <article className="admin-panel">
        <div className="admin-panel-header">
          <h2>3. Зургийн цомог</h2>
        </div>
        <p className="media-hint">Хуудасны доод хэсэгт эгнээгээр гарах нэмэлт зургууд. Хэрэггүй бол хоосон орхино.</p>
        <div className="media-chapter">
          <input
            type="text"
            value={media.galleryTitle}
            onChange={(e) => patch({ galleryTitle: e.target.value })}
            placeholder="Цомгийн гарчиг (заавал биш)"
          />
          <ImageList folder={media.folder} images={media.gallery} max={12} onChange={(gallery) => patch({ gallery })} />
        </div>
      </article>

      <div className="media-actions">
        <AdminButton type="button" icon={Save} isLoading={saving} disabled={!dirty} onClick={save}>
          Хадгалах
        </AdminButton>
        {current === "custom" && (
          <AdminButton type="button" variant="secondary" icon={RotateCcw} disabled={saving} onClick={reset}>
            Анхны хуудас руу буцаах
          </AdminButton>
        )}
        <a className="media-site-link" href={`${siteUrl}/products/${slug}`} target="_blank" rel="noreferrer">
          <ExternalLink size={15} /> Сайтад харах
        </a>
        {dirty && <span className="media-warn">Хадгалаагүй өөрчлөлт байна</span>}
      </div>

      <style jsx>{`
        .media-editor { display: flex; flex-direction: column; gap: 20px; }
        .media-note { margin: 0; color: var(--admin-muted); font-size: 0.9rem; }
        .media-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .media-field { display: flex; flex-direction: column; gap: 8px; }
        .media-field label:not(.media-check) { font-size: 0.8rem; font-weight: 600; color: var(--admin-text-secondary); margin-top: 6px; }
        .media-check { display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: var(--admin-text); cursor: pointer; }
        .media-check input { width: auto; }
        .media-hint { margin: 0 0 12px; font-size: 0.82rem; color: var(--admin-muted); }
        .media-field .media-hint { margin: 0; }
        .media-steps { padding: 14px 18px; border: 1px solid var(--admin-border); border-radius: 14px; background: var(--admin-surface); font-size: 0.88rem; }
        .media-steps ol { margin: 8px 0 0; padding-left: 20px; display: flex; flex-direction: column; gap: 4px; color: var(--admin-text-secondary); }
        .media-warn { font-size: 0.8rem; color: var(--admin-warning); }
        .media-chapters { display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
        .media-chapter { display: flex; flex-direction: column; gap: 10px; width: 100%; padding: 16px; border: 1px solid var(--admin-border); border-radius: 14px; background: var(--admin-card); }
        .media-chapter-head { display: flex; align-items: center; justify-content: space-between; }
        .media-row-actions { display: flex; gap: 6px; }
        .media-row-actions button { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--admin-border); background: transparent; color: var(--admin-text-secondary); cursor: pointer; }
        .media-row-actions button:disabled { opacity: 0.35; cursor: not-allowed; }
        .media-row-actions button.danger:hover { color: var(--admin-danger); border-color: var(--admin-danger); }
        .media-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; position: sticky; bottom: 0; padding: 14px 0; background: var(--admin-bg, transparent); }
        .media-site-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.88rem; color: var(--admin-primary); text-decoration: none; }
        @media (max-width: 760px) { .media-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

/** Uploads a short clip for the hero background; the hero image is its poster. */
function VideoSlot({ video, onChange }: { video: string; onChange: (id: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      toast("Видео 25MB-аас бага байх ёстой.", "error");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setUploading(true);
    try {
      onChange(await uploadImage(file, "/product-pages/"));
    } catch (err: any) {
      toast(err.message || "Видео хуулахад алдаа гарлаа.", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="video-slot">
      {video && /^https?:\/\//i.test(video) && (
        <video src={video} muted loop playsInline controls preload="metadata" />
      )}
      {video && !/^https?:\/\//i.test(video) && <span className="video-built">Сайтын анхны видео ашиглаж байна</span>}
      <div className="video-buttons">
        <AdminButton type="button" variant="secondary" size="sm" icon={ImagePlus} isLoading={uploading} onClick={() => inputRef.current?.click()}>
          {video ? "Видео солих" : "Видео оруулах"}
        </AdminButton>
        {video && (
          <AdminButton type="button" variant="ghost" size="sm" icon={Trash2} onClick={() => onChange("")}>
            Хасах
          </AdminButton>
        )}
      </div>
      <input ref={inputRef} type="file" accept="video/mp4,video/webm" onChange={onFile} style={{ display: "none" }} />
      <style jsx>{`
        .video-slot { display: flex; flex-direction: column; gap: 8px; }
        .video-slot video { width: 100%; max-height: 180px; border-radius: 12px; background: #000; object-fit: contain; }
        .video-built { font-size: 0.85rem; color: var(--admin-text-secondary); }
        .video-buttons { display: flex; gap: 8px; }
      `}</style>
    </div>
  );
}

/** One image with a replace button, alt text and optional caption. */
function ImageSlot({
  label,
  folder,
  image,
  onChange,
  onRemove,
  required,
  withCaption,
}: {
  label?: string;
  folder: string;
  image: MediaImage;
  onChange: (image: MediaImage) => void;
  onRemove?: () => void;
  required?: boolean;
  withCaption?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "/product-pages/");
      onChange({ ...image, id: url });
    } catch (err: any) {
      toast(err.message || "Зураг хуулахад алдаа гарлаа.", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const src = mediaPreviewUrl(folder, image.id);

  return (
    <div className="slot">
      {label && <span className="slot-label">{label}{required ? " *" : ""}</span>}
      <button type="button" className="slot-preview" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {src ? <img src={src} alt={image.alt} /> : null}
        <span className="slot-cta">
          <ImagePlus size={18} /> {uploading ? "Хуулж байна…" : src ? "Зураг солих" : "Зураг оруулах"}
        </span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
      <input
        type="text"
        value={image.alt}
        onChange={(e) => onChange({ ...image, alt: e.target.value })}
        placeholder="Зураг юуг харуулж буй тухай (хайлт, дэлгэц уншигчид)"
      />
      {withCaption && (
        <input
          type="text"
          value={image.caption ?? ""}
          onChange={(e) => onChange({ ...image, caption: e.target.value })}
          placeholder="Зургийн доорх богино бичиг (заавал биш)"
        />
      )}
      {onRemove && (
        <button type="button" className="slot-remove" onClick={onRemove} title="Зураг хасах">
          <X size={14} />
        </button>
      )}
      <style jsx>{`
        .slot { position: relative; display: flex; flex-direction: column; gap: 8px; }
        .slot-label { font-size: 0.8rem; font-weight: 600; color: var(--admin-text-secondary); }
        .slot-preview { position: relative; display: grid; place-items: center; aspect-ratio: 16 / 10; overflow: hidden; border: 2px dashed var(--admin-border); border-radius: 12px; background: var(--admin-surface); cursor: pointer; padding: 0; }
        .slot-preview img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
        .slot-cta { position: relative; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; background: rgba(255, 255, 255, 0.92); color: var(--admin-text); font-size: 0.8rem; font-weight: 600; box-shadow: var(--admin-shadow-sm); }
        .slot-remove { position: absolute; top: 6px; right: 6px; display: grid; place-items: center; width: 26px; height: 26px; border: 0; border-radius: 50%; background: rgba(0, 0, 0, 0.55); color: #fff; cursor: pointer; }
        .slot-remove:hover { background: var(--admin-danger); }
      `}</style>
    </div>
  );
}

function ImageList({
  folder,
  images,
  max,
  onChange,
}: {
  folder: string;
  images: MediaImage[];
  max: number;
  onChange: (images: MediaImage[]) => void;
}) {
  return (
    <div className="list">
      {images.map((image, index) => (
        <div className="cell" key={index}>
          <ImageSlot
            folder={folder}
            image={image}
            withCaption
            onChange={(next) => onChange(images.map((img, i) => (i === index ? next : img)))}
            onRemove={() => onChange(images.filter((_, i) => i !== index))}
          />
          {images.length > 1 && (
            <div className="reorder">
              <button type="button" disabled={index === 0} onClick={() => onChange(move(images, index, -1))} title="Өмнө нь">
                <ArrowUp size={13} />
              </button>
              <button type="button" disabled={index === images.length - 1} onClick={() => onChange(move(images, index, 1))} title="Дараа нь">
                <ArrowDown size={13} />
              </button>
            </div>
          )}
        </div>
      ))}
      {images.length < max && (
        <button type="button" className="add" onClick={() => onChange([...images, { id: "", alt: "" }])}>
          <Plus size={18} /> Зураг нэмэх
        </button>
      )}
      <style jsx>{`
        .list { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; align-items: start; }
        .cell { display: flex; flex-direction: column; gap: 6px; }
        .reorder { display: flex; gap: 6px; }
        .reorder button { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--admin-border); background: transparent; color: var(--admin-text-secondary); cursor: pointer; }
        .reorder button:disabled { opacity: 0.35; cursor: not-allowed; }
        .add { display: flex; align-items: center; justify-content: center; gap: 6px; aspect-ratio: 16 / 10; border: 2px dashed var(--admin-border); border-radius: 12px; background: transparent; color: var(--admin-muted); font-weight: 600; cursor: pointer; }
        .add:hover { border-color: var(--admin-primary); color: var(--admin-primary); }
      `}</style>
    </div>
  );
}
