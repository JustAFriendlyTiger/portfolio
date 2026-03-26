"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? `Upload failed (${res.status})`);
        if (!data.url) throw new Error("No URL returned from upload");
        urls.push(data.url);
      }
      onChange([...value, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setUrlInput("");
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="rounded-lg border border-zinc-700 w-full object-cover aspect-video bg-zinc-900"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-black/70 text-white rounded px-1.5 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="cursor-pointer inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500 transition-colors">
        {uploading ? "Uploading..." : "Upload photo"}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="Or paste an image URL..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
        />
        <button
          type="button"
          onClick={addUrl}
          className="text-sm text-zinc-400 hover:text-white border border-zinc-700 rounded-lg px-3 py-2 transition-colors"
        >
          Add
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
