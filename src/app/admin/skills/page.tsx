import { prisma } from "@/lib/prisma";
import SkillsForm from "./SkillsForm";
import { updateSkills } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills",
};

function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export default async function AdminSkillsPage() {
  const rows = await prisma.siteConfig.findMany();
  const config = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const skills = parseJson<{ name: string; items: string[] }[]>(config.skills, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <a
          href="/admin"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          ← Back to admin
        </a>
        <h1 className="text-2xl font-bold text-white mt-4">Skills & Tools</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Displayed on the Resume page — organize by category.
        </p>
      </div>
      <SkillsForm initial={skills} action={updateSkills} />
    </div>
  );
}
