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
  const resumeUrl = config.resumeUrl ?? null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
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
            <p className="text-zinc-400 text-lg mb-4">{config.heroTagline}</p>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              View Projects
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
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 text-sm font-medium px-4 py-2 rounded-lg hover:border-zinc-500 hover:text-white transition-colors"
              >
                Download Resume
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1v8M4 6l3 3 3-3M2 11h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ) : (
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 text-sm font-medium px-4 py-2 rounded-lg hover:border-zinc-500 hover:text-white transition-colors"
              >
                Resume
              </Link>
            )}
            <Link
              href="/contact"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Get in touch →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick links row */}
      <div className="flex flex-wrap gap-2 mb-14 pb-10 border-b border-zinc-800">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 border border-zinc-800 px-3 py-1.5 rounded-full hover:border-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 4.5v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Engineering Tools
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 border border-zinc-800 px-3 py-1.5 rounded-full hover:border-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <rect x="1.5" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M4 5h6M4 7.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Blog
        </Link>
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
    </div>
  );
}
