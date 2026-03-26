import ProjectForm from "@/components/admin/ProjectForm";
import { createProject } from "../actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Project",
};

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <a
          href="/admin"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          ← Back to admin
        </a>
        <h1 className="text-2xl font-bold text-white mt-4">New Project</h1>
      </div>

      <ProjectForm action={createProject} submitLabel="Create Project" />
    </div>
  );
}
