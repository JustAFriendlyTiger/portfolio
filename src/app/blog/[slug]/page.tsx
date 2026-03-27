import { prisma } from "@/lib/prisma";
import { parseTags, formatDate } from "@/lib/utils";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.published) notFound();

  const tags = parseTags(post.tags);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-4">
        <Link
          href="/blog"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          ← Back to Blog
        </Link>
      </div>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
          {post.title}
        </h1>
        <p className="text-zinc-400 text-lg mb-4">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-3">
          <time className="text-xs font-mono text-zinc-500">{formatDate(post.date)}</time>
          {tags.length > 0 && (
            <>
              <span className="text-zinc-700">·</span>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <div className="border-t border-zinc-800 pt-8">
        <article className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </article>
      </div>

      <div className="mt-16 pt-8 border-t border-zinc-800">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M12 7H2M6 3L2 7l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All posts
        </Link>
      </div>
    </div>
  );
}
