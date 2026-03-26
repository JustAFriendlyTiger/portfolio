"use client";

interface TagBadgeProps {
  tag: string;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

export default function TagBadge({
  tag,
  active = false,
  onClick,
  size = "md",
}: TagBadgeProps) {
  const base =
    size === "sm"
      ? "px-2 py-0.5 text-xs rounded"
      : "px-3 py-1 text-sm rounded-full";

  const style = active
    ? "bg-blue-600 text-white border border-blue-500"
    : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white";

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${base} ${style} transition-all cursor-pointer font-mono`}
      >
        {tag}
      </button>
    );
  }

  return (
    <span className={`${base} bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono`}>
      {tag}
    </span>
  );
}
