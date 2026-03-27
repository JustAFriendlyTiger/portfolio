"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function updateTimeline(formData: FormData) {
  await requireAuth();

  const timelineJson = formData.get("timeline") as string;
  let validated = "[]";
  try {
    const parsed = JSON.parse(timelineJson);
    if (Array.isArray(parsed)) validated = JSON.stringify(parsed);
  } catch {
    // keep fallback
  }

  await prisma.siteConfig.upsert({
    where: { key: "timeline" },
    update: { value: validated },
    create: { key: "timeline", value: validated },
  });

  revalidatePath("/resume");
  redirect("/admin/timeline");
}
