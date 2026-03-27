export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string | null;
  tags: string; // JSON string: string[]
  links: string | null; // JSON string: { label: string; url: string }[]
  images: string | null; // JSON string: string[]
  featured: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ParsedProject extends Omit<Project, "tags" | "links" | "images"> {
  parsedTags: string[];
  parsedLinks: ProjectLink[];
  parsedImages: string[];
}

export interface AboutSection {
  id: string;
  title: string;
  body: string;
  images: string; // JSON string: string[]
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedAboutSection extends Omit<AboutSection, "images"> {
  parsedImages: string[];
}

export interface SiteConfig {
  id: string;
  key: string;
  value: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tags: string; // JSON string: string[]
  published: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedBlogPost extends Omit<BlogPost, "tags"> {
  parsedTags: string[];
}
