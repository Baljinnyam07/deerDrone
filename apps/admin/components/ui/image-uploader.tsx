"use client";

import { useState, useRef } from "react";
import { Plus, X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageObject {
  url: string;
  path?: string;
  display_order?: number;
}

interface ImageUploaderProps {
  images: ImageObject[];
  onChange: (images: ImageObject[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/uploads/product-image", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        return await res.json();
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      const newImages = [...images, ...uploadedImages.map((img: any, idx: number) => ({
        url: img.url,
        path: img.path,
        display_order: images.length + idx
      }))];

      onChange(newImages.slice(0, maxImages));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Зураг хуулахад алдаа гарлаа.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const nextImages = [...images];
    nextImages.splice(index, 1);
    // Update display orders
    const updatedImages = nextImages.map((img, idx) => ({ ...img, display_order: idx }));
    onChange(updatedImages);
  };

  return (
    <div className="image-uploader-root">
      <div className="image-uploader-grid">
        <AnimatePresence initial={false}>
          {images.map((img, index) => (
            <motion.div
              key={img.url}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="image-preview-card"
            >
              <img src={img.url} alt={`Preview ${index}`} className="image-preview-img" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="image-remove-btn"
                title="Устгах"
              >
                <X size={14} />
              </button>
              {index === 0 && <span className="image-primary-badge">Үндсэн</span>}
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length < maxImages && (
          <button
            type="button"
            className={`image-upload-trigger ${isUploading ? 'is-loading' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <div className="image-upload-icon-wrapper">
                  <Upload size={20} />
                </div>
                <span className="image-upload-text">Зураг нэмэх</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        style={{ display: 'none' }}
      />

      <style jsx>{`
        .image-uploader-root {
          width: 100%;
        }
        .image-uploader-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 16px;
        }
        .image-preview-card {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border-subtle);
          box-shadow: var(--admin-shadow-sm);
        }
        .image-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .image-remove-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 24px;
          height: 24px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .image-remove-btn:hover {
          background: var(--admin-danger);
          transform: scale(1.1);
        }
        .image-primary-badge {
          position: absolute;
          bottom: 6px;
          left: 6px;
          background: var(--admin-primary);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .image-upload-trigger {
          aspect-ratio: 1;
          border-radius: 12px;
          border: 2px dashed var(--admin-border);
          background: var(--admin-card);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--admin-muted);
        }
        .image-upload-trigger:hover:not(:disabled) {
          border-color: var(--admin-primary);
          background: var(--admin-surface);
          color: var(--admin-primary);
        }
        .image-upload-trigger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .image-upload-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--admin-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .image-upload-trigger:hover .image-upload-icon-wrapper {
          background: rgba(37, 99, 235, 0.1);
          transform: translateY(-2px);
        }
        .image-upload-text {
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
