import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
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

const studios = ["Ubisoft", "Electronic Arts", "Avantaj Play", "Personal project"];

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

        {studios.map((studio) => {
          const items = gallery.filter((g) => g.studio === studio);
          return (
            <section key={studio} className="mt-16">
              <h2 className="font-mono text-[13px] uppercase tracking-[0.2em] text-faint">
                {studio}
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, i) => {
                  const img = imageFor(item.slug);
                  return (
                    <Reveal key={item.slug} variant="zoom" delay={(i % 3) * 90}>
                      <article className="group rounded-2xl border border-line bg-surface transition duration-300 hover:z-20 hover:-translate-y-1 hover:border-faint hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.7)]">
                        <div className="relative aspect-[16/9] [perspective:700px]">
                          {img ? (
                            <>
                              {/* Blurred copy fills the frame behind the full,
                                  uncropped image, so any aspect ratio fits
                                  without cutting anything off. */}
                              <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
                                <Image
                                  src={img}
                                  alt=""
                                  aria-hidden="true"
                                  fill
                                  quality={25}
                                  sizes="400px"
                                  className="scale-110 object-cover blur-xl brightness-50 grayscale transition duration-500 group-hover:grayscale-0"
                                />
                              </div>
                              {/* The poster itself sits above and is allowed to
                                  grow past the card edges on hover — that
                                  overflow is what sells the 3D pop. */}
                              <Image
                                src={img}
                                alt={item.name}
                                fill
                                quality={90}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                                className="object-contain grayscale transition-all duration-500 ease-out group-hover:[transform:translateZ(70px)] group-hover:[filter:grayscale(0)_drop-shadow(0_18px_28px_rgba(0,0,0,0.7))]"
                              />
                            </>
                          ) : (
                            <div className="flex h-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-surface to-background p-6 transition duration-500 group-hover:scale-105">
                              <p className="text-center font-mono text-sm uppercase tracking-[0.2em] text-faint transition-colors duration-300 group-hover:text-muted">
                                {item.name}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-line p-5">
                          <h3 className="text-[15px] font-medium tracking-tight text-foreground">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-[13px] text-faint">{item.detail}</p>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          );
        })}

        <p className="mt-16 text-sm text-faint">
          <Link
            href="/"
            className="text-muted underline underline-offset-4 hover:text-foreground"
          >
            ← Back to the main page
          </Link>
        </p>
      </main>
    </>
  );
}
