"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";

interface SiteConfigFormProps {
  initial: {
    heroName: string;
    heroTagline: string;
    heroImage: string;
    resumeUrl: string;
    contactEmail: string;
    contactLinkedIn: string;
    contactGitHub: string;
    projectsBannerVisible: boolean;
  };
  action: (formData: FormData) => Promise<void>;
}

export default function SiteConfigForm({ initial, action }: SiteConfigFormProps) {
  const [heroImage, setHeroImage] = useState<string[]>(
    initial.heroImage ? [initial.heroImage] : []
  );
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    formData.set("heroImage", heroImage[0] ?? "");
    await action(formData);
    setPending(false);
  }

  const inputClass =
    "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors";
  const labelClass = "block text-sm text-zinc-400 mb-1.5";

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Hero section */}
      <div className="space-y-5">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Hero</h2>

        <div>
          <label className={labelClass} htmlFor="heroName">Name</label>
          <input
            id="heroName"
            name="heroName"
            defaultValue={initial.heroName}
            className={inputClass}
            placeholder="Jane Smith"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="heroTagline">Tagline</label>
          <input
            id="heroTagline"
            name="heroTagline"
            defaultValue={initial.heroTagline}
            className={inputClass}
            placeholder="Mechanical Engineering Student @ University of …"
          />
        </div>

        <div>
          <label className={labelClass}>Profile Photo</label>
          <ImageUpload
            value={heroImage}
            onChange={(urls) => setHeroImage(urls.slice(-1))}
          />
          <p className="text-xs text-zinc-600 mt-1">
            Only the most recently added photo is used.
          </p>
        </div>
      </div>

      {/* Resume */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Resume</h2>
        <div>
          <label className={labelClass} htmlFor="resumeUrl">Resume PDF URL</label>
          <input
            id="resumeUrl"
            name="resumeUrl"
            defaultValue={initial.resumeUrl}
            className={inputClass}
            placeholder="https://drive.google.com/…"
          />
          <p className="text-xs text-zinc-600 mt-1">
            Direct link to your PDF resume (Google Drive, Dropbox, etc.).
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Contact</h2>
        <div>
          <label className={labelClass} htmlFor="contactEmail">Email</label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={initial.contactEmail}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contactLinkedIn">LinkedIn URL</label>
          <input
            id="contactLinkedIn"
            name="contactLinkedIn"
            defaultValue={initial.contactLinkedIn}
            className={inputClass}
            placeholder="https://linkedin.com/in/yourhandle"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contactGitHub">GitHub URL</label>
          <input
            id="contactGitHub"
            name="contactGitHub"
            defaultValue={initial.contactGitHub}
            className={inputClass}
            placeholder="https://github.com/yourhandle"
          />
        </div>
      </div>

      {/* Projects banner */}
      <div className="space-y-3 pt-4 border-t border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Projects Page</h2>
        <div className="flex items-center gap-3">
          <input
            id="projectsBannerVisible"
            name="projectsBannerVisible"
            type="checkbox"
            defaultChecked={initial.projectsBannerVisible}
            className="w-4 h-4 accent-amber-500 cursor-pointer"
          />
          <label htmlFor="projectsBannerVisible" className="text-sm text-zinc-400 cursor-pointer">
            Show &quot;portfolio is being updated&quot; banner
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="bg-white text-black font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
