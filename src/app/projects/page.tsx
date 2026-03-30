import { prisma } from "@/lib/prisma";
import { parseProject } from "@/lib/utils";
import PortfolioClient from "@/app/PortfolioClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const [projects, configRows] = await Promise.all([
    prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { date: "desc" }],
    }),
    prisma.siteConfig.findMany(),
  ]);

  const config = Object.fromEntries(configRows.map((r) => [r.key, r.value]));
  const parsedProjects = projects.map(parseProject);
  const bannerVisible = config.projectsBannerVisible !== "false";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Engineering Projects
        </h1>
        <p className="text-zinc-400 text-lg mb-4">
          A collection of things I&apos;ve built, researched, and shipped.
        </p>
        {bannerVisible && (
          <p className="inline-flex items-center gap-2 text-sm text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            This portfolio is actively being updated — more projects coming soon.
          </p>
        )}
      </div>

      <PortfolioClient projects={parsedProjects} />
    </div>
  );
}
