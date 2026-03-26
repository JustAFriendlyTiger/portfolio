import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-32 text-center">
      <p className="text-zinc-600 font-mono text-sm mb-4">404</p>
      <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
      <p className="text-zinc-400 mb-8 text-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
      >
        ← Back to projects
      </Link>
    </div>
  );
}
