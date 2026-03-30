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
    { key: "resumeUrl", value: (formData.get("resumeUrl") as string) ?? "" },
    { key: "contactEmail", value: (formData.get("contactEmail") as string) ?? "" },
    { key: "contactLinkedIn", value: (formData.get("contactLinkedIn") as string) ?? "" },
    { key: "contactGitHub", value: (formData.get("contactGitHub") as string) ?? "" },
    { key: "projectsBannerVisible", value: formData.get("projectsBannerVisible") === "on" ? "true" : "false" },
  ];

  for (const { key, value } of entries) {
    await prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/resume");
  revalidatePath("/contact");
  redirect("/admin/site-config");
}
