import Link from "next/link";
import TagBadge from "./TagBadge";
import { formatDate } from "@/lib/utils";
import type { ParsedProject } from "@/lib/types";

interface ProjectCardProps {
  project: ParsedProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/40 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {project.featured && (
              <span className="inline-block text-xs font-mono text-amber-400 mb-2 uppercase tracking-wider">
                Featured
              </span>
            )}
            <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
              {project.title}
            </h2>
          </div>
          <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors mt-1 shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed flex-1">
          {project.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {project.parsedTags.slice(0, 4).map((tag) => (
              <TagBadge key={tag} tag={tag} size="sm" />
            ))}
            {project.parsedTags.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-zinc-500 font-mono">
                +{project.parsedTags.length - 4}
              </span>
            )}
          </div>
          <time className="text-xs text-zinc-600 shrink-0 font-mono">
            {formatDate(project.date)}
          </time>
        </div>
      </article>
    </Link>
  );
}
