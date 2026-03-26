import AboutSectionForm from "@/components/admin/AboutSectionForm";
import { createAboutSection } from "../actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New About Section",
};

export default function NewAboutSectionPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <a
          href="/admin/about"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          ← Back to about sections
        </a>
        <h1 className="text-2xl font-bold text-white mt-4">New About Section</h1>
      </div>

      <AboutSectionForm action={createAboutSection} submitLabel="Create Section" />
    </div>
  );
}
