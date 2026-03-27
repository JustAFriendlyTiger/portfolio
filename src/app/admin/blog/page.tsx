import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseTags, formatDate } from "@/lib/utils";
import { deleteBlogPost } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Posts",
};

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <a
            href="/admin"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
          >
            ← Back to admin
          </a>
          <h1 className="text-2xl font-bold text-white mt-3">Blog Posts</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 border border-zinc-800 rounded-xl">
          <p className="mb-4">No blog posts yet.</p>
          <Link href="/admin/blog/new" className="text-blue-400 hover:text-blue-300">
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="text-left px-6 py-3 text-zinc-400 font-medium">Title</th>
                <th className="text-left px-6 py-3 text-zinc-400 font-medium hidden sm:table-cell">Tags</th>
                <th className="text-left px-6 py-3 text-zinc-400 font-medium hidden md:table-cell">Date</th>
                <th className="text-left px-6 py-3 text-zinc-400 font-medium hidden sm:table-cell">Published</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const tags = parseTags(post.tags);
                return (
                  <tr
                    key={post.id}
                    className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-white hover:text-blue-400 transition-colors font-medium"
                        target="_blank"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-zinc-500 text-xs font-mono">
                        {tags.slice(0, 3).join(", ")}
                        {tags.length > 3 ? ` +${tags.length - 3}` : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <time className="text-zinc-500 text-xs font-mono">
                        {formatDate(post.date)}
                      </time>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {post.published ? (
                        <span className="text-emerald-400 text-xs">Yes</span>
                      ) : (
                        <span className="text-zinc-600 text-xs">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 justify-end">
                        <Link
                          href={`/admin/blog/edit/${post.id}`}
                          className="text-zinc-400 hover:text-white transition-colors text-xs"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          title={post.title}
                          action={async () => {
                            "use server";
                            await deleteBlogPost(post.id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
