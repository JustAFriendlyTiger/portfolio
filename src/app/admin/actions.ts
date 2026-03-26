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

function parseImagesFormValue(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(Array.isArray(parsed) ? parsed.filter(Boolean) : []);
  } catch {
    return "[]";
  }
}

export async function createProject(formData: FormData) {
  await requireAuth();

  const title = formData.get("title") as string;
  const slugInput = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const body = formData.get("body") as string;
  const tagsRaw = formData.get("tags") as string;
  const linksJson = formData.get("linksJson") as string;
  const imagesRaw = formData.get("images") as string;
  const featured = formData.get("featured") === "on";
  const dateStr = formData.get("date") as string;

  const slug = slugInput.trim() || slugify(title);
  const tags = JSON.stringify(
    tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  );
  const images = parseImagesFormValue(imagesRaw);

  await prisma.project.create({
    data: {
      title,
      slug,
      description,
      body: body || null,
      tags,
      links: linksJson || null,
      images: images === "[]" ? null : images,
      featured,
      date: dateStr ? new Date(dateStr) : new Date(),
    },
  });

  revalidatePath("/projects");
  redirect("/admin");
}

export async function updateProject(id: string, formData: FormData) {
  await requireAuth();

  const title = formData.get("title") as string;
  const slugInput = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const body = formData.get("body") as string;
  const tagsRaw = formData.get("tags") as string;
  const linksJson = formData.get("linksJson") as string;
  const imagesRaw = formData.get("images") as string;
  const featured = formData.get("featured") === "on";
  const dateStr = formData.get("date") as string;

  const slug = slugInput.trim() || slugify(title);
  const tags = JSON.stringify(
    tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  );
  const images = parseImagesFormValue(imagesRaw);

  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      body: body || null,
      tags,
      links: linksJson || null,
      images: images === "[]" ? null : images,
      featured,
      date: dateStr ? new Date(dateStr) : undefined,
    },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  redirect("/admin");
}

export async function deleteProject(id: string) {
  await requireAuth();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/projects");
  redirect("/admin");
}
