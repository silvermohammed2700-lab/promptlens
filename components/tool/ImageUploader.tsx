"use client";
import { useRef, useState, useCallback, DragEvent, ChangeEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import imageCompression from "browser-image-compression";

interface ImageUploaderProps {
  onImageReady: (base64: string, mimeType: string, file: File) => void;
  disabled?: boolean;
}

const SUPPORTED_FORMATS = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "image/bmp", "image/tiff", "image/avif", "image/heic",
  "image/svg+xml", "image/x-icon", "image/heif",
];

const MAX_SIZE = 5 * 1024 * 1024;

async function processAndCompressFile(file: File): Promise<{ base64: string; mimeType: string, file: File }> {
    const options = {
      maxSizeMB: 5,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };
    const compressedFile = await imageCompression(file, options);
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            if (base64) {
                resolve({ base64, mimeType: 'image/jpeg', file: compressedFile });
            } else {
                reject(new Error("Failed to convert file to base64"));
            }
        };
        reader.onerror = (error) => reject(error);
    });
}


export function ImageUploader({ onImageReady, disabled }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    if (file.size > MAX_SIZE) {
      setError("Image too large. Maximum 5MB allowed.");
      return;
    }
    const isNative = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    const needsConversion = !isNative;
    setConverting(true);
    try {
        const { base64, mimeType, file: processedFile } = await processAndCompressFile(file);
        const previewUrl = `data:image/jpeg;base64,${base64}`;
      setPreview(previewUrl);
      if (needsConversion) {
        trackEvent({ name: "format_converted", params: { from: file.type, to: "image/jpeg" } });
      }
      trackEvent({ name: "image_uploaded", params: { format: file.type, size: file.size, converted: needsConversion } });
      onImageReady(base64, mimeType, processedFile);
    } catch {
      setError("Failed to process image. Please try a different file.");
    } finally {
      setConverting(false);
    }
  }, [onImageReady]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0]!;
    if (!SUPPORTED_FORMATS.includes(file.type) && !file.name.match(/\.(heic|avif|bmp|tiff?|svg|ico)$/i)) {
      setError("Unsupported format. Please upload JPG, PNG, WEBP, GIF, BMP, TIFF, AVIF, HEIC, SVG, or ICO.");
      return;
    }
    processFile(file);
  }, [processFile]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleUrlLoad = useCallback(async () => {
    if (!urlInput.trim()) return;
    setError(null);
    setConverting(true);
    try {
      const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(urlInput)}`);
      if (!res.ok) throw new Error("Failed to fetch image from URL");
      const blob = await res.blob();
      const file = new File([blob], "image-from-url.jpg", { type: blob.type || "image/jpeg" });
      trackEvent({ name: "url_loaded", params: { type: "url" } });
      await processFile(file);
    } catch {
      setError("Could not load image from URL. Please try uploading directly.");
    } finally {
      setConverting(false);
      setShowUrlInput(false);
      setUrlInput("");
    }
  }, [urlInput, processFile]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) processFile(file);
        break;
      }
    }
  }, [processFile]);

  const reset = () => {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full" onPaste={handlePaste}>
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center w-full min-h-[240px] rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
            ${isDragging ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border-2)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-2)]"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.heic,.avif"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
            disabled={disabled}
          />
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface-3)] flex items-center justify-center text-3xl">
              🖼️
            </div>
            <div>
              <p className="text-[var(--text)] font-medium">Drop image here or click to upload</p>
              <p className="text-[var(--muted)] text-sm mt-1">JPG, PNG, WEBP, GIF, BMP, TIFF, AVIF, HEIC, SVG, ICO · Max 5MB</p>
            </div>
            {converting && (
              <p className="text-[var(--accent)] text-sm animate-pulse">Converting format...</p>
            )}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowUrlInput(!showUrlInput); }}
                className="text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--accent)]/50 min-h-[36px]"
              >
                🔗 Load from URL
              </button>
            </div>
            {showUrlInput && (
              <div className="flex gap-2 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 bg-[var(--surface-3)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] min-h-[36px]"
                  onKeyDown={(e) => e.key === "Enter" && handleUrlLoad()}
                />
                <button
                  type="button"
                  onClick={handleUrlLoad}
                  className="px-3 py-2 bg-[var(--accent)] text-white rounded-lg text-sm hover:opacity-90 min-h-[36px]"
                >
                  Load
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] animate-slide-up">
          <img src={preview} alt="Uploaded" className="w-full max-h-[400px] object-contain bg-[var(--surface-3)]" />
          <button
            type="button"
            onClick={reset}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors text-sm"
          >
            ✕
          </button>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-[var(--accent-2)] flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
      <p className="mt-2 text-xs text-[var(--muted)]">💡 You can also paste an image from clipboard (Ctrl+V)</p>
    </div>
  );
}
