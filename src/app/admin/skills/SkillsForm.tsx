"use client";

import { useState } from "react";

interface SkillCategory {
  name: string;
  items: string[];
}

interface SkillsFormProps {
  initial: SkillCategory[];
  action: (formData: FormData) => Promise<void>;
}

export default function SkillsForm({ initial, action }: SkillsFormProps) {
  const [categories, setCategories] = useState<SkillCategory[]>(
    initial.length > 0 ? initial : [{ name: "", items: [] }]
  );
  const [pending, setPending] = useState(false);

  function addCategory() {
    setCategories([...categories, { name: "", items: [] }]);
  }

  function removeCategory(i: number) {
    setCategories(categories.filter((_, idx) => idx !== i));
  }

  function updateCategoryName(i: number, name: string) {
    setCategories(categories.map((c, idx) => (idx === i ? { ...c, name } : c)));
  }

  function updateItems(i: number, raw: string) {
    const items = raw.split(",").map((s) => s.trim()).filter(Boolean);
    setCategories(categories.map((c, idx) => (idx === i ? { ...c, items } : c)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData();
    formData.set("skills", JSON.stringify(categories.filter((c) => c.name.trim())));
    await action(formData);
    setPending(false);
  }

  const inputClass =
    "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors";
  const labelClass = "block text-sm text-zinc-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {categories.map((cat, i) => (
        <div key={i} className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className={labelClass}>Category Name</label>
              <input
                className={inputClass}
                placeholder="e.g. CAD Software"
                value={cat.name}
                onChange={(e) => updateCategoryName(i, e.target.value)}
              />
            </div>
            {categories.length > 1 && (
              <button
                type="button"
                onClick={() => removeCategory(i)}
                className="mt-6 text-zinc-600 hover:text-red-400 transition-colors text-xs"
              >
                Remove
              </button>
            )}
          </div>
          <div>
            <label className={labelClass}>Tools / Skills (comma-separated)</label>
            <input
              className={inputClass}
              placeholder="SolidWorks, AutoCAD, CATIA, Fusion 360"
              value={cat.items.join(", ")}
              onChange={(e) => updateItems(i, e.target.value)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCategory}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Add Category
      </button>

      <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="bg-white text-black font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : "Save Skills"}
        </button>
      </div>
    </form>
  );
}
