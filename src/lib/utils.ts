import type { Project, ParsedProject, AboutSection, ParsedAboutSection } from "./types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((t) => typeof t === "string") : [];
  } catch {
    return [];
  }
}

export function parseLinks(links: string | null): { label: string; url: string }[] {
  if (!links) return [];
  try {
    const parsed = JSON.parse(links);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseImages(images: string | null): string[] {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseAboutSection(section: AboutSection): ParsedAboutSection {
  return {
    ...section,
    parsedImages: parseImages(section.images),
  };
}

export function parseProject(project: Project): ParsedProject {
  return {
    ...project,
    parsedTags: parseTags(project.tags),
    parsedLinks: parseLinks(project.links),
    parsedImages: parseImages(project.images),
  };
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
