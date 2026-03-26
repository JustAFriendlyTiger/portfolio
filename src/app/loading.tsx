export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <div className="h-10 w-64 bg-zinc-800 rounded-lg animate-pulse mb-3" />
        <div className="h-6 w-96 bg-zinc-800/60 rounded animate-pulse" />
      </div>
      <div className="flex gap-3 mb-8">
        <div className="flex-1 h-10 bg-zinc-800 rounded-lg animate-pulse" />
        <div className="w-36 h-10 bg-zinc-800 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-52 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
