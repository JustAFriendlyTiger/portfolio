"use client";

import TagBadge from "./TagBadge";

interface TagFilterProps {
  allTags: string[];
  activeTags: string[];
  onToggle: (tag: string) => void;
}

export default function TagFilter({
  allTags,
  activeTags,
  onToggle,
}: TagFilterProps) {
  if (allTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider mr-1">
        Filter:
      </span>
      {allTags.map((tag) => (
        <TagBadge
          key={tag}
          tag={tag}
          active={activeTags.includes(tag)}
          onClick={() => onToggle(tag)}
        />
      ))}
      {activeTags.length > 0 && (
        <button
          onClick={() => activeTags.forEach((t) => onToggle(t))}
          className="text-xs text-zinc-500 hover:text-zinc-300 font-mono ml-1 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
