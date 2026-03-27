import BlogPostForm from "@/components/admin/BlogPostForm";
import { createBlogPost } from "../actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Blog Post",
};

export default function NewBlogPostPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <a
          href="/admin/blog"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          ← Back to blog
        </a>
        <h1 className="text-2xl font-bold text-white mt-4">New Blog Post</h1>
      </div>
      <BlogPostForm action={createBlogPost} submitLabel="Create Post" />
    </div>
  );
}
