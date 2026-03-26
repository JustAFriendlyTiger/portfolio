"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-32 text-center">
      <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
      <p className="text-zinc-400 mb-8 text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
