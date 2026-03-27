import { prisma } from "@/lib/prisma";
import { parseTags, formatDate } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
        <p className="text-zinc-400">
          Engineering concepts, project deep-dives, and lessons from the lab.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 border border-zinc-800 rounded-xl text-zinc-500">
          <p>No posts yet — check back soon.</p>
        </div>
      ) : (
        <div className="space-y-px border border-zinc-800 rounded-xl overflow-hidden">
          {posts.map((post) => {
            const tags = parseTags(post.tags);
            return (
              <article
                key={post.id}
                className="p-6 bg-zinc-900/20 hover:bg-zinc-900/60 transition-colors border-b border-zinc-800/50 last:border-0"
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                        {post.title}
                      </h2>
                      <p className="text-zinc-400 text-sm line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      {tags.length > 0 && (
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
                      )}
                    </div>
                    <time className="text-xs font-mono text-zinc-500 shrink-0 mt-0.5">
                      {formatDate(post.date)}
                    </time>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
