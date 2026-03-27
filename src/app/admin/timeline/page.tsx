import { prisma } from "@/lib/prisma";
import TimelineForm from "./TimelineForm";
import { updateTimeline } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
};

function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export default async function AdminTimelinePage() {
  const rows = await prisma.siteConfig.findMany();
  const config = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const timeline = parseJson<{ year: string; title: string; description: string; type: "education" | "work" | "competition" | "project" }[]>(
    config.timeline,
    []
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <a
          href="/admin"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          ← Back to admin
        </a>
        <h1 className="text-2xl font-bold text-white mt-4">Timeline</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Academic, work, and competition history — shown on the Resume page.
        </p>
      </div>
      <TimelineForm initial={timeline} action={updateTimeline} />
    </div>
  );
}
