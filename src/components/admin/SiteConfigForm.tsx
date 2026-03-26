"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";

interface SiteConfigFormProps {
  initial: { heroName: string; heroTagline: string; heroImage: string };
  action: (formData: FormData) => Promise<void>;
}

export default function SiteConfigForm({ initial, action }: SiteConfigFormProps) {
  const [heroImage, setHeroImage] = useState<string[]>(
    initial.heroImage ? [initial.heroImage] : []
  );
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("heroImage", heroImage[0] ?? "");
    await action(formData);
    setPending(false);
  }

  const inputClass =
    "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors";
  const labelClass = "block text-sm text-zinc-400 mb-1.5";

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="heroName">
          Name
        </label>
        <input
          id="heroName"
          name="heroName"
          defaultValue={initial.heroName}
          className={inputClass}
          placeholder="Jane Smith"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="heroTagline">
          Tagline
        </label>
        <input
          id="heroTagline"
          name="heroTagline"
          defaultValue={initial.heroTagline}
          className={inputClass}
          placeholder="Software engineer building..."
        />
      </div>

      <div>
        <label className={labelClass}>Profile Photo</label>
        <ImageUpload
          value={heroImage}
          onChange={(urls) => setHeroImage(urls.slice(-1))}
        />
        <p className="text-xs text-zinc-600 mt-1">
          Only the most recently added photo is used.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="bg-white text-black font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
