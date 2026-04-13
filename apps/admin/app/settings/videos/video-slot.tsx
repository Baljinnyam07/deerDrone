"use client";

import { useState } from "react";
import { Upload, Trash2, CheckCircle, AlertCircle, Loader2, Play } from "lucide-react";

interface VideoSlotProps {
  slotKey: string;
  label: string;
  description: string;
  initialUrl: string | null;
}

export function VideoSlot({ slotKey, label, description, initialUrl }: VideoSlotProps) {
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 60MB (Supabase free tier max is usually 50MB per file, but let's be safe)
    if (file.size > 60 * 1024 * 1024) {
      setError("Файлын хэмжээ хэтэрхий том байна (Max: 60MB)");
      return;
    }

    if (!file.type.includes("video/mp4")) {
      setError("Зөвхөн .mp4 файл оруулна уу");
      return;
    }

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", slotKey);

    try {
      const res = await fetch("/api/settings/videos", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setUrl(data.url);
      } else {
        setError(data.error || "Алдаа гарлаа");
      }
    } catch (err) {
      setError("Upload хийхэд алдаа гарлаа");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Энэ видеог устгахдаа итгэлтэй байна уу?")) return;

    setUploading(true);
    try {
      const res = await fetch("/api/settings/videos", {
        method: "DELETE",
        body: JSON.stringify({ key: slotKey }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        setUrl(null);
      }
    } catch (err) {
      setError("Устгахад алдаа гарлаа");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-panel video-slot">
      <div className="video-slot-content">
        <div className="video-slot-info">
          <div className="video-slot-header">
            <h3 className="video-slot-title">{label}</h3>
            <span className={`video-slot-status ${url ? "active" : "empty"}`}>
              {url ? "ИДЭВХТЭЙ" : "ХООСОН (Fallback ашиглана)"}
            </span>
          </div>
          <p className={`admin-muted video-slot-desc`}>{description}</p>
          
          <div className="video-slot-actions">
            {url ? (
              <>
                <button 
                  onClick={handleDelete}
                  disabled={uploading}
                  className="admin-secondary-btn" 
                  style={{ color: "var(--admin-danger)", borderColor: "rgba(239, 68, 68, 0.2)", padding: "8px 16px" }}
                >
                  <Trash2 size={16} />
                  <span>Устгах</span>
                </button>
                <a 
                  href={url} 
                  target="_blank" 
                  className="admin-secondary-btn" 
                  style={{ padding: "8px 16px" }}
                >
                  <Play size={16} />
                  <span>Үзэх</span>
                </a>
              </>
            ) : (
              <div style={{ position: "relative" }}>
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={handleUpload}
                  disabled={uploading}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: "pointer",
                    width: "100%",
                  }}
                />
                <button className="admin-primary-btn" disabled={uploading}>
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  <span>{uploading ? "Оруулж байна..." : "Видео хуулах"}</span>
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="video-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {url && (
          <div className="video-thumbnail">
            <video 
              src={url} 
              onMouseOver={(e) => e.currentTarget.play()}
              onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
              muted
              loop
            />
            <div className="video-thumbnail-overlay">
              <Play size={24} color="white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
