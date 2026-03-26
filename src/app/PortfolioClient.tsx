"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import TagFilter from "@/components/ui/TagFilter";
import SortDropdown, { type SortOption } from "@/components/ui/SortDropdown";
import ProjectCard from "@/components/ui/ProjectCard";
import type { ParsedProject } from "@/lib/types";

interface PortfolioClientProps {
  projects: ParsedProject[];
}

export default function PortfolioClient({ projects }: PortfolioClientProps) {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("date-desc");

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach((p) => p.parsedTags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [projects]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    let result = projects;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.parsedTags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeTags.length > 0) {
      result = result.filter((p) =>
        activeTags.every((t) => p.parsedTags.includes(t))
      );
    }

    return [...result].sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
      }
    });
  }, [projects, search, activeTags, sort]);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      <TagFilter allTags={allTags} activeTags={activeTags} onToggle={toggleTag} />

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg mb-2">No projects found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-zinc-600 font-mono">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            {search || activeTags.length > 0 ? " found" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
