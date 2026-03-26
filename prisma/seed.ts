import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create owner user
  const email = process.env.OWNER_EMAIL ?? "admin@example.com";
  const password = process.env.OWNER_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Owner account created: ${email}`);

  // Sample projects
  const projects = [
    {
      title: "Real-Time Signal Analyzer",
      slug: "real-time-signal-analyzer",
      description:
        "A desktop application for visualizing and analyzing real-time signals from hardware sensors, featuring FFT processing and configurable alert thresholds.",
      body: `## Overview\n\nThis tool was built to help engineers monitor live sensor data without expensive proprietary software.\n\n## Features\n\n- Real-time FFT visualization\n- Configurable alert thresholds\n- CSV export of recorded sessions\n- Supports USB and serial interfaces\n\n## Tech Stack\n\nPython, PyQt6, NumPy, SciPy, PySerial`,
      tags: JSON.stringify(["Python", "Signal Processing", "Hardware", "PyQt"]),
      links: JSON.stringify([
        { label: "GitHub", url: "https://github.com" },
        { label: "Demo Video", url: "https://youtube.com" },
      ]),
      featured: true,
    },
    {
      title: "Automated PCB Test Fixture",
      slug: "automated-pcb-test-fixture",
      description:
        "A custom pogo-pin test fixture with automated firmware flashing and functional verification, reducing board test time from 8 minutes to 45 seconds.",
      body: `## Problem\n\nManual PCB testing was a bottleneck in production — each board took 8+ minutes to flash and verify.\n\n## Solution\n\nDesigned a pogo-pin fixture that interfaces with a Raspberry Pi controller. A Python script handles flashing over SWD, runs self-tests, and logs pass/fail to a SQLite database.\n\n## Results\n\n- 90% reduction in test cycle time\n- Zero operator error in flashing\n- Full audit log for traceability`,
      tags: JSON.stringify([
        "Hardware",
        "Python",
        "Raspberry Pi",
        "Manufacturing",
      ]),
      links: JSON.stringify([{ label: "GitHub", url: "https://github.com" }]),
      featured: true,
    },
    {
      title: "Portfolio Website",
      slug: "portfolio-website",
      description:
        "This portfolio site — built with Next.js, Prisma, and NextAuth. Features a searchable project database with tag filtering and a secure admin panel.",
      body: `## Stack\n\n- **Framework**: Next.js 14 (App Router)\n- **Database**: SQLite via Prisma ORM\n- **Auth**: NextAuth.js with credentials provider\n- **Styling**: Tailwind CSS\n\n## Features\n\n- Server-side data fetching with client-side filtering\n- JWT session management\n- Markdown project descriptions\n- Tag-based search and filter`,
      tags: JSON.stringify(["Next.js", "TypeScript", "Prisma", "Tailwind CSS"]),
      links: JSON.stringify([{ label: "GitHub", url: "https://github.com" }]),
      featured: false,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  console.log(`Seeded ${projects.length} projects.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
