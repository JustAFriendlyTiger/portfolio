import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-zinc-800 sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-semibold text-white hover:text-zinc-300 transition-colors"
        >
          Marcus Onisor
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/projects"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/blog"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/resume"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Resume
          </Link>
          <Link
            href="/tools"
            className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Tools
          </Link>
          <Link
            href="/contact"
            className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Contact
          </Link>

          {session ? (
            <>
              <Link
                href="/admin"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Admin
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
