"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

export async function createAboutSection(formData: FormData) {
  await requireAuth();

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const imagesRaw = formData.get("images") as string;
  const orderStr = formData.get("order") as string;

  await prisma.aboutSection.create({
    data: {
      title,
      body,
      images: parseImagesFormValue(imagesRaw),
      order: orderStr ? parseInt(orderStr, 10) : 0,
    },
  });

  revalidatePath("/");
  redirect("/admin/about");
}

export async function updateAboutSection(id: string, formData: FormData) {
  await requireAuth();

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const imagesRaw = formData.get("images") as string;
  const orderStr = formData.get("order") as string;

  await prisma.aboutSection.update({
    where: { id },
    data: {
      title,
      body,
      images: parseImagesFormValue(imagesRaw),
      order: orderStr ? parseInt(orderStr, 10) : 0,
    },
  });

  revalidatePath("/");
  redirect("/admin/about");
}

export async function deleteAboutSection(id: string) {
  await requireAuth();
  await prisma.aboutSection.delete({ where: { id } });
  revalidatePath("/");
  redirect("/admin/about");
}
