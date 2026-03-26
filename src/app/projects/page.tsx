import { prisma } from "@/lib/prisma";
import { parseProject } from "@/lib/utils";
import PortfolioClient from "@/app/PortfolioClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { date: "desc" }],
  });

  const parsedProjects = projects.map(parseProject);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Engineering Projects
        </h1>
        <p className="text-zinc-400 text-lg">
          A collection of things I&apos;ve built, researched, and shipped.
        </p>
      </div>

      <PortfolioClient projects={parsedProjects} />
    </div>
  );
}
