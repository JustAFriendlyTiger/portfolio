import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { updateBlogPost } from "../../actions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Edit Blog Post",
};

export default async function EditBlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  const tags = parseTags(post.tags);

  const initial = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    body: post.body,
    tags: tags.join(", "),
    published: post.published,
    date: post.date.toISOString().split("T")[0],
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <a
          href="/admin/blog"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          ← Back to blog
        </a>
        <h1 className="text-2xl font-bold text-white mt-4">Edit Blog Post</h1>
      </div>
      <BlogPostForm
        initial={initial}
        action={async (formData) => {
          "use server";
          await updateBlogPost(post.id, formData);
        }}
        submitLabel="Save Changes"
      />
    </div>
  );
}
