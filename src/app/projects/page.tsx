import type { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { GalleryCard } from "@/components/GalleryCard";
import { gallery, identity } from "@/content/site";

export const metadata: Metadata = {
  title: `Projects — ${identity.name}`,
  description:
    "Every project I have worked on: AAA productions, mobile and VR products, and personal engineering projects.",
};

// Build-time check: a gallery image renders once a file named after the
// slug exists in public/projects/ in any common image format. Matching is
// case-insensitive so "AC-Shadows.PNG" still works on case-sensitive hosts
// like Vercel. Until a file exists, the card shows a typographic tile.
const imageExtensions = ["jpg", "jpeg", "png", "webp", "avif", "gif"];

const galleryDir = path.join(process.cwd(), "public", "projects");

// Read the folder on every render, not at module load, so images added
// while the dev server is running show up on refresh.
function listGalleryFiles(): string[] {
  return fs.existsSync(galleryDir) ? fs.readdirSync(galleryDir) : [];
}

function imageFor(slug: string): string | null {
  const match = listGalleryFiles().find((file) => {
    const dot = file.lastIndexOf(".");
    if (dot === -1) return false;
    const base = file.slice(0, dot).toLowerCase();
    const ext = file.slice(dot + 1).toLowerCase();
    return base === slug.toLowerCase() && imageExtensions.includes(ext);
  });
  return match ? `/projects/${match}` : null;
}

// Non-gaming domains shown first; Ubisoft + EA grouped under one "Gaming" header.
const domainGroups: { label: string; studios: string[] }[] = [
  { label: "Personal projects", studios: ["Personal projects"] },
  { label: "Avantaj Play", studios: ["Avantaj Play"] },
  { label: "Gaming — Ubisoft & EA", studios: ["Ubisoft", "Electronic Arts"] },
];

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-32 md:pt-40">
        <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-faint">
          All projects
        </p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,2.75rem)] font-semibold tracking-tight text-foreground">
          Everything I have worked on
        </h1>
        <p className="mt-4 max-w-[60ch] leading-relaxed text-muted">
          {gallery.length} products across seven platforms: AAA productions,
          live-service titles, mobile and VR products, and personal engineering
          projects.
        </p>

        {domainGroups.map(({ label, studios }) => {
          const items = gallery.filter((g) => studios.includes(g.studio));
          if (items.length === 0) return null;
          return (
            <section key={label} className="mt-16">
              <h2 className="font-mono text-[13px] uppercase tracking-[0.2em] text-faint">
                {label}
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, i) => {
                  const img = imageFor(item.slug);
                  return (
                    <Reveal key={item.slug} variant="zoom" delay={(i % 3) * 90}>
                      <GalleryCard item={item} img={img} />
                    </Reveal>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="mt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-2.5 text-sm text-muted transition-colors hover:border-faint hover:text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7.5 3.5L3 8l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to overview
          </Link>
        </div>
      </main>
    </>
  );
}
