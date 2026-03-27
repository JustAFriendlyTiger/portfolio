"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function updateSkills(formData: FormData) {
  await requireAuth();

  const skillsJson = formData.get("skills") as string;
  let validated = "[]";
  try {
    const parsed = JSON.parse(skillsJson);
    if (Array.isArray(parsed)) validated = JSON.stringify(parsed);
  } catch {
    // keep fallback
  }

  await prisma.siteConfig.upsert({
    where: { key: "skills" },
    update: { value: validated },
    create: { key: "skills", value: validated },
  });

  revalidatePath("/resume");
  redirect("/admin/skills");
}
