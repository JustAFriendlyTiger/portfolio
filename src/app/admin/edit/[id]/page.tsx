import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseProject } from "@/lib/utils";
import ProjectForm from "@/components/admin/ProjectForm";
import { updateProject } from "../../actions";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Project",
};

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const raw = await prisma.project.findUnique({ where: { id } });

  if (!raw) notFound();

  const project = parseProject(raw);

  const boundAction = updateProject.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <a
          href="/admin"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          ← Back to admin
        </a>
        <h1 className="text-2xl font-bold text-white mt-4">Edit Project</h1>
        <p className="text-zinc-500 text-sm mt-1">{project.title}</p>
      </div>

      <ProjectForm
        project={project}
        action={boundAction}
        submitLabel="Save Changes"
      />
    </div>
  );
}
