"use client";

import { useState, useEffect } from "react";
import { slugify } from "@/lib/utils";
import ImageUpload from "./ImageUpload";
import type { ParsedProject } from "@/lib/types";

interface ProjectFormProps {
  project?: ParsedProject;
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
}

export default function ProjectForm({
  project,
  action,
  submitLabel = "Save Project",
}: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!project);
  const [tags, setTags] = useState(project?.parsedTags.join(", ") ?? "");
  const [tagPreview, setTagPreview] = useState<string[]>(project?.parsedTags ?? []);
  const [links, setLinks] = useState<{ label: string; url: string }[]>(
    project?.parsedLinks ?? [{ label: "", url: "" }]
  );
  const [linksJson, setLinksJson] = useState(
    JSON.stringify(project?.parsedLinks ?? [])
  );
  const [images, setImages] = useState<string[]>(project?.parsedImages ?? []);
  const [pending, setPending] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched]);

  // Update tag preview
  useEffect(() => {
    const parsed = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setTagPreview(parsed);
  }, [tags]);

  // Sync links to hidden JSON field
  useEffect(() => {
    const valid = links.filter((l) => l.label && l.url);
    setLinksJson(JSON.stringify(valid));
  }, [links]);

  function addLink() {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removeLink(i: number) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateLink(i: number, field: "label" | "url", value: string) {
    setLinks((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l))
    );
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("linksJson", linksJson);
    formData.set("images", JSON.stringify(images));
    await action(formData);
    setPending(false);
  }

  const inputClass =
    "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors";
  const labelClass = "block text-sm text-zinc-400 mb-1.5";

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className={labelClass} htmlFor="title">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="My Engineering Project"
        />
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass} htmlFor="slug">
          Slug <span className="text-zinc-600 text-xs ml-1">(URL path)</span>
        </label>
        <input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className={`${inputClass} font-mono`}
          placeholder="my-engineering-project"
        />
        <p className="text-xs text-zinc-600 mt-1 font-mono">
          /projects/{slug || "..."}
        </p>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass} htmlFor="description">
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={2}
          defaultValue={project?.description}
          className={`${inputClass} resize-none`}
          placeholder="A one-sentence summary shown on the project card."
        />
      </div>

      {/* Body */}
      <div>
        <label className={labelClass} htmlFor="body">
          Full Description{" "}
          <span className="text-zinc-600 text-xs ml-1">(Markdown)</span>
        </label>
        <textarea
          id="body"
          name="body"
          rows={10}
          defaultValue={project?.body ?? ""}
          className={`${inputClass} resize-y font-mono text-xs`}
          placeholder="## Overview&#10;&#10;Write the full project description in Markdown..."
        />
      </div>

      {/* Tags */}
      <div>
        <label className={labelClass} htmlFor="tags">
          Tags{" "}
          <span className="text-zinc-600 text-xs ml-1">(comma-separated)</span>
        </label>
        <input
          id="tags"
          name="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputClass}
          placeholder="React, TypeScript, Node.js"
        />
        {tagPreview.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tagPreview.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      <div>
        <label className={labelClass}>External Links</label>
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                className={`${inputClass} w-32 shrink-0`}
                placeholder="Label"
              />
              <input
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="text-zinc-600 hover:text-red-400 transition-colors px-2"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors mt-1"
          >
            + Add link
          </button>
        </div>
        <input type="hidden" name="linksJson" value={linksJson} />
      </div>

      {/* Images */}
      <div>
        <label className={labelClass}>Images</label>
        <ImageUpload value={images} onChange={setImages} />
      </div>

      {/* Date */}
      <div>
        <label className={labelClass} htmlFor="date">
          Project Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={
            project?.date
              ? new Date(project.date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          className={`${inputClass} w-auto`}
        />
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          defaultChecked={project?.featured ?? false}
          className="w-4 h-4 accent-blue-500 cursor-pointer"
        />
        <label htmlFor="featured" className="text-sm text-zinc-400 cursor-pointer">
          Featured project (pinned at top)
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="bg-white text-black font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        <a
          href="/admin"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
