import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const rows = await prisma.siteConfig.findMany();
  const config = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  const email = config.contactEmail ?? null;
  const linkedin = config.contactLinkedIn ?? null;
  const github = config.contactGitHub ?? null;
  const name = config.heroName ?? null;

  const links = [
    {
      label: "Email",
      value: email,
      href: email ? `mailto:${email}` : null,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      display: email,
    },
    {
      label: "LinkedIn",
      value: linkedin,
      href: linkedin,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M6 8v6M6 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M10 14v-3a2 2 0 014 0v3M10 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      display: linkedin ? "LinkedIn Profile" : null,
    },
    {
      label: "GitHub",
      value: github,
      href: github,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.69-1.07-2.69-1.07a2.12 2.12 0 00-.89-1.17c-.73-.5.05-.49.05-.49a1.68 1.68 0 011.22.82 1.7 1.7 0 002.33.67 1.7 1.7 0 01.5-1.07c-1.78-.2-3.64-.89-3.64-3.95a3.1 3.1 0 01.82-2.14 2.87 2.87 0 01.08-2.11s.67-.22 2.2.82a7.58 7.58 0 014 0c1.53-1.04 2.2-.82 2.2-.82a2.87 2.87 0 01.08 2.11 3.1 3.1 0 01.82 2.14c0 3.07-1.87 3.75-3.65 3.95a1.9 1.9 0 01.54 1.48v2.2c0 .21.14.46.55.38A8 8 0 0010 2z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      display: github ? "GitHub Profile" : null,
    },
  ].filter((l) => l.value);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Get in Touch</h1>
        <p className="text-zinc-400">
          {name
            ? `Feel free to reach out — I'd love to connect.`
            : `Reach out via any of the channels below.`}
        </p>
      </div>

      {links.length > 0 ? (
        <div className="space-y-3 mb-12">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href!}
              target={link.label !== "Email" ? "_blank" : undefined}
              rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
              className="flex items-center gap-4 p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-zinc-600 hover:bg-zinc-900/80 transition-colors group"
            >
              <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                {link.icon}
              </span>
              <div>
                <p className="text-xs font-mono text-zinc-500 mb-0.5">{link.label}</p>
                <p className="text-sm text-white">{link.display}</p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="ml-auto text-zinc-600 group-hover:text-zinc-400 transition-colors"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ))}
        </div>
      ) : (
        <div className="mb-12 p-6 border border-zinc-800 rounded-xl text-zinc-500 text-sm">
          No contact info configured yet.{" "}
          <Link href="/admin/site-config" className="text-blue-400 hover:text-blue-300">
            Add it in admin → Site Config.
          </Link>
        </div>
      )}

      <div className="flex items-center gap-6 pt-8 border-t border-zinc-800">
        <Link
          href="/projects"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          View Projects
        </Link>
        <Link
          href="/resume"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Resume
        </Link>
      </div>
    </div>
  );
}
