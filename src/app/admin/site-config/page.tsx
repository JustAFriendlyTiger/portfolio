import { prisma } from "@/lib/prisma";
import SiteConfigForm from "@/components/admin/SiteConfigForm";
import { updateSiteConfig } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Config",
};

export default async function SiteConfigPage() {
  const rows = await prisma.siteConfig.findMany();
  const config = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  const initial = {
    heroName: config.heroName ?? "",
    heroTagline: config.heroTagline ?? "",
    heroImage: config.heroImage ?? "",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <a
          href="/admin"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          ← Back to admin
        </a>
        <h1 className="text-2xl font-bold text-white mt-4">Site Config</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Hero section — name, tagline, and profile photo.
        </p>
      </div>

      <SiteConfigForm initial={initial} action={updateSiteConfig} />
    </div>
  );
}
