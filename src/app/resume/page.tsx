import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
};

interface SkillCategory {
  name: string;
  items: string[];
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: "education" | "work" | "competition" | "project";
}

function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const typeColors: Record<string, string> = {
  education: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  work: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  competition: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  project: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default async function ResumePage() {
  const rows = await prisma.siteConfig.findMany();
  const config = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  const resumeUrl = config.resumeUrl ?? null;
  const skills = parseJson<SkillCategory[]>(config.skills, []);
  const timeline = parseJson<TimelineEvent[]>(config.timeline, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {config.heroName ?? "Resume"}
          </h1>
          {config.heroTagline && (
            <p className="text-zinc-400">{config.heroTagline}</p>
          )}
        </div>
        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors shrink-0 ml-4"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1v8M4 6l3 3 3-3M2 11h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download PDF
          </a>
        )}
      </div>

      {/* Skills & Tools */}
      {skills.length > 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-zinc-800">
            Skills & Tools
          </h2>
          <div className="space-y-6">
            {skills.map((category) => (
              <div key={category.name}>
                <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="text-sm text-zinc-300 bg-zinc-800/60 border border-zinc-700/50 px-3 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length === 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-zinc-800">
            Skills & Tools
          </h2>
          <p className="text-zinc-500 text-sm">
            No skills added yet.{" "}
            <Link href="/admin/skills" className="text-blue-400 hover:text-blue-300">
              Configure in admin.
            </Link>
          </p>
        </section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-zinc-800">
            Timeline
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-zinc-800" />
            <div className="space-y-6">
              {timeline.map((event, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-20 shrink-0 text-right">
                    <span className="text-xs font-mono text-zinc-500 leading-6">
                      {event.year}
                    </span>
                  </div>
                  {/* Dot */}
                  <div className="relative flex items-start pt-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 border-2 border-zinc-600 z-10" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-white">
                        {event.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          typeColors[event.type] ?? typeColors.project
                        }`}
                      >
                        {event.type}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-zinc-400">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {timeline.length === 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-zinc-800">
            Timeline
          </h2>
          <p className="text-zinc-500 text-sm">
            No timeline events yet.{" "}
            <Link href="/admin/timeline" className="text-blue-400 hover:text-blue-300">
              Configure in admin.
            </Link>
          </p>
        </section>
      )}

      {/* Footer links */}
      <div className="flex items-center gap-6 pt-8 border-t border-zinc-800">
        <Link
          href="/projects"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          View Projects
        </Link>
        <Link
          href="/contact"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
