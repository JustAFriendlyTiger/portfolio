import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [configRows, sections] = await Promise.all([
    prisma.siteConfig.findMany(),
    prisma.aboutSection.findMany({ orderBy: { order: "asc" } }),
  ]);

  const config = Object.fromEntries(configRows.map((r) => [r.key, r.value]));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <div className="flex items-center gap-6 mb-16">
        {config.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={config.heroImage}
            alt={config.heroName ?? "Profile"}
            className="w-24 h-24 rounded-full object-cover border-2 border-zinc-700 shrink-0"
          />
        )}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {config.heroName ?? "Hi, I'm ..."}
          </h1>
          {config.heroTagline && (
            <p className="text-zinc-400 text-lg">{config.heroTagline}</p>
          )}
        </div>
      </div>

      {/* About sections */}
      {sections.map((section) => {
        const images = parseImages(section.images);
        return (
          <section key={section.id} className="mb-14">
            <h2 className="text-xl font-semibold text-white mb-4 pb-3 border-b border-zinc-800">
              {section.title}
            </h2>
            <article className="prose-custom">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.body}
              </ReactMarkdown>
            </article>
            {images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {images.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={`${section.title} image ${i + 1}`}
                    className="rounded-lg border border-zinc-800 w-full object-cover aspect-video"
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {sections.length === 0 && (
        <p className="text-zinc-500 text-sm">
          No about sections yet.{" "}
          <Link href="/admin/about" className="text-blue-400 hover:text-blue-300">
            Add some in the admin.
          </Link>
        </p>
      )}

      {/* CTA to projects */}
      <div className="mt-16 pt-10 border-t border-zinc-800">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          View my projects
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
