import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteAboutSection } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Sections",
};

export default async function AdminAboutPage() {
  const sections = await prisma.aboutSection.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <a
            href="/admin"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
          >
            ← Back to admin
          </a>
          <h1 className="text-2xl font-bold text-white mt-3">About Sections</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {sections.length} section{sections.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/about/new"
          className="inline-flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          New Section
        </Link>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 border border-zinc-800 rounded-xl">
          <p className="mb-4">No about sections yet.</p>
          <Link
            href="/admin/about/new"
            className="text-blue-400 hover:text-blue-300"
          >
            Add your first section
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="text-left px-6 py-3 text-zinc-400 font-medium w-16">
                  Order
                </th>
                <th className="text-left px-6 py-3 text-zinc-400 font-medium">
                  Title
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr
                  key={section.id}
                  className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                    {section.order}
                  </td>
                  <td className="px-6 py-4 text-white">{section.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/admin/about/edit/${section.id}`}
                        className="text-zinc-400 hover:text-white transition-colors text-xs"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        title={section.title}
                        action={async () => {
                          "use server";
                          await deleteAboutSection(section.id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
