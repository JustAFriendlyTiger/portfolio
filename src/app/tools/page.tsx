import type { Metadata } from "next";
import ToolsClient from "./ToolsClient";

export const metadata: Metadata = {
  title: "Engineering Tools",
};

export default function ToolsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Engineering Tools</h1>
        <p className="text-zinc-400">
          Quick calculators for common mechanical engineering problems.
        </p>
      </div>
      <ToolsClient />
    </div>
  );
}
