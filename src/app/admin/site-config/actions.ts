"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function updateSiteConfig(formData: FormData) {
  await requireAuth();

  const entries = [
    { key: "heroName", value: (formData.get("heroName") as string) ?? "" },
    { key: "heroTagline", value: (formData.get("heroTagline") as string) ?? "" },
    { key: "heroImage", value: (formData.get("heroImage") as string) ?? "" },
  ];

  for (const { key, value } of entries) {
    await prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath("/");
  redirect("/admin/site-config");
}
