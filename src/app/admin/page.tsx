import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseTags, formatDate } from "@/lib/utils";
import { deleteProject } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const [projects, blogPosts] = await Promise.all([
    prisma.project.findMany({ orderBy: { date: "desc" } }),
    prisma.blogPost.findMany({ orderBy: { date: "desc" }, take: 5 }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          New Project
        </Link>
      </div>

      {/* Quick links to other admin sections */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {[
          { href: "/admin/about", title: "About Sections", desc: "Edit the About Me page content" },
          { href: "/admin/site-config", title: "Site Config", desc: "Hero, resume link, contact info" },
          { href: "/admin/blog", title: "Blog Posts", desc: "Write & manage blog posts" },
          { href: "/admin/skills", title: "Skills & Tools", desc: "Configure the skills section" },
          { href: "/admin/timeline", title: "Timeline", desc: "Academic & experience history" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors"
          >
            <p className="text-white font-medium text-sm">{link.title}</p>
            <p className="text-zinc-500 text-xs mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>

      {/* Blog posts recent */}
      {blogPosts.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Blog Posts</h2>
            <Link href="/admin/blog" className="text-sm text-zinc-400 hover:text-white transition-colors">
              View all →
            </Link>
          </div>
          <div className="border border-zinc-800 rounded-xl overflow-hidden">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/30 transition-colors"
              >
                <div>
                  <p className="text-sm text-white">{post.title}</p>
                  <p className="text-xs font-mono text-zinc-500 mt-0.5">{formatDate(post.date)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {post.published ? (
                    <span className="text-xs text-emerald-400">Published</span>
                  ) : (
                    <span className="text-xs text-zinc-600">Draft</span>
                  )}
                  <Link
                    href={`/admin/blog/edit/${post.id}`}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects table */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Projects</h2>
        <span className="text-zinc-500 text-sm">{projects.length} total</span>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 border border-zinc-800 rounded-xl">
          <p className="mb-4">No projects yet.</p>
          <Link href="/admin/new" className="text-blue-400 hover:text-blue-300">
            Add your first project
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
                <th className="text-left px-6 py-3 text-zinc-400 font-medium hidden sm:table-cell">Featured</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const tags = parseTags(project.tags);
                return (
                  <tr
                    key={project.id}
                    className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-white hover:text-blue-400 transition-colors font-medium"
                        target="_blank"
                      >
                        {project.title}
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
                        {formatDate(project.date)}
                      </time>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {project.featured ? (
                        <span className="text-amber-400 text-xs">Yes</span>
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 justify-end">
                        <Link
                          href={`/admin/edit/${project.id}`}
                          className="text-zinc-400 hover:text-white transition-colors text-xs"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          title={project.title}
                          action={async () => {
                            "use server";
                            await deleteProject(project.id);
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
