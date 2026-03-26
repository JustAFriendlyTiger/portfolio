import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";
import { parseProject, formatDate } from "@/lib/utils";
import TagBadge from "@/components/ui/TagBadge";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Not Found" };
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const raw = await prisma.project.findUnique({ where: { slug } });

  if (!raw) notFound();

  const project = parseProject(raw);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-10 font-mono"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M9 2L4 7l5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to projects
      </Link>

      {/* Header */}
      <div className="mb-10">
        {project.featured && (
          <span className="inline-block text-xs font-mono text-amber-400 mb-3 uppercase tracking-wider">
            Featured
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          {project.title}
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm border-t border-zinc-800 pt-6">
          <time className="text-zinc-500 font-mono text-xs">
            {formatDate(project.date)}
          </time>
          <div className="flex flex-wrap gap-2">
            {project.parsedTags.map((tag) => (
              <TagBadge key={tag} tag={tag} size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* Links */}
      {project.parsedLinks.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-10">
          {project.parsedLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:text-white hover:border-zinc-500 transition-all"
            >
              {link.label}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 10L10 2M5 2h5v5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ))}
        </div>
      )}

      {/* Images */}
      {project.parsedImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {project.parsedImages.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`${project.title} image ${i + 1}`}
              className="rounded-lg border border-zinc-800 w-full object-cover aspect-video"
            />
          ))}
        </div>
      )}

      {/* Body */}
      {project.body && (
        <article className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.body}
          </ReactMarkdown>
        </article>
      )}
    </div>
  );
}
