"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";
import type { ParsedAboutSection } from "@/lib/types";

interface AboutSectionFormProps {
  section?: ParsedAboutSection;
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
}

export default function AboutSectionForm({
  section,
  action,
  submitLabel = "Save Section",
}: AboutSectionFormProps) {
  const [images, setImages] = useState<string[]>(section?.parsedImages ?? []);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("images", JSON.stringify(images));
    await action(formData);
    setPending(false);
  }

  const inputClass =
    "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors";
  const labelClass = "block text-sm text-zinc-400 mb-1.5";

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="title">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={section?.title}
          className={inputClass}
          placeholder="About, Skills, Experience..."
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="order">
          Display Order{" "}
          <span className="text-zinc-600 text-xs ml-1">(lower = first)</span>
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={section?.order ?? 0}
          className={`${inputClass} w-24`}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="body">
          Content <span className="text-zinc-600 text-xs ml-1">(Markdown)</span>
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={10}
          defaultValue={section?.body}
          className={`${inputClass} resize-y font-mono text-xs`}
          placeholder="Write in Markdown..."
        />
      </div>

      <div>
        <label className={labelClass}>Photos</label>
        <ImageUpload value={images} onChange={setImages} />
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="bg-white text-black font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        <a
          href="/admin/about"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
