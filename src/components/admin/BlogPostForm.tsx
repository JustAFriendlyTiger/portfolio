"use client";

import { useState } from "react";

interface BlogPostFormProps {
  initial?: {
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    tags: string;
    published: boolean;
    date: string;
  };
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
}

export default function BlogPostForm({
  initial,
  action,
  submitLabel = "Create Post",
}: BlogPostFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [pending, setPending] = useState(false);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("slug", slug || slugify(title));
    await action(formData);
    setPending(false);
  }

  const inputClass =
    "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors";
  const labelClass = "block text-sm text-zinc-400 mb-1.5";

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          required
          className={inputClass}
          placeholder="My Engineering Post"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="slug">Slug</label>
        <input
          id="slug"
          name="slug"
          className={inputClass}
          placeholder="my-engineering-post"
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
        />
        <p className="text-xs text-zinc-600 mt-1">URL: /blog/{slug || "…"}</p>
      </div>

      <div>
        <label className={labelClass} htmlFor="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          className={inputClass}
          placeholder="A short summary shown in the blog listing…"
          defaultValue={initial?.excerpt ?? ""}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="body">Body (Markdown)</label>
        <textarea
          id="body"
          name="body"
          required
          rows={16}
          className={`${inputClass} font-mono text-xs leading-relaxed`}
          placeholder="# Introduction&#10;&#10;Write your post here in Markdown…"
          defaultValue={initial?.body ?? ""}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="tags">Tags (comma-separated)</label>
        <input
          id="tags"
          name="tags"
          className={inputClass}
          placeholder="FEA, SolidWorks, Stress Analysis"
          defaultValue={initial?.tags ?? ""}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          className={inputClass}
          defaultValue={initial?.date ?? new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={initial?.published ?? false}
          className="w-4 h-4 accent-white rounded"
        />
        <label htmlFor="published" className="text-sm text-zinc-400">
          Published (visible on public blog)
        </label>
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="bg-white text-black font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <a
          href="/admin/blog"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
