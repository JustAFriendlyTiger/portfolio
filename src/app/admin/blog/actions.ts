"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { auth } from "@/lib/auth";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function createBlogPost(formData: FormData) {
  await requireAuth();

  const title = formData.get("title") as string;
  const slugInput = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const body = formData.get("body") as string;
  const tagsRaw = formData.get("tags") as string;
  const published = formData.get("published") === "on";
  const dateStr = formData.get("date") as string;

  const slug = slugInput.trim() || slugify(title);
  const tags = JSON.stringify(
    tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  );

  await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      body,
      tags,
      published,
      date: dateStr ? new Date(dateStr) : new Date(),
    },
  });

  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAuth();

  const title = formData.get("title") as string;
  const slugInput = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const body = formData.get("body") as string;
  const tagsRaw = formData.get("tags") as string;
  const published = formData.get("published") === "on";
  const dateStr = formData.get("date") as string;

  const slug = slugInput.trim() || slugify(title);
  const tags = JSON.stringify(
    tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  );

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      body,
      tags,
      published,
      date: dateStr ? new Date(dateStr) : undefined,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireAuth();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  redirect("/admin/blog");
}
