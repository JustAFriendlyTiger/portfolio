import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseAboutSection } from "@/lib/utils";
import AboutSectionForm from "@/components/admin/AboutSectionForm";
import { updateAboutSection } from "../../actions";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit About Section",
};

export default async function EditAboutSectionPage({ params }: PageProps) {
  const { id } = await params;
  const raw = await prisma.aboutSection.findUnique({ where: { id } });

  if (!raw) notFound();

  const section = parseAboutSection(raw);
  const boundAction = updateAboutSection.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <a
          href="/admin/about"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          ← Back to about sections
        </a>
        <h1 className="text-2xl font-bold text-white mt-4">Edit About Section</h1>
        <p className="text-zinc-500 text-sm mt-1">{section.title}</p>
      </div>

      <AboutSectionForm
        section={section}
        action={boundAction}
        submitLabel="Save Changes"
      />
    </div>
  );
}
