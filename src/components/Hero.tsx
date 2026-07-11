import Image from "next/image";
import { identity, stats } from "@/content/site";
import { QaBug } from "./QaBug";
import fs from "node:fs";
import path from "node:path";

// Server component: portrait renders only once the file exists in /public.
const portraitPath = "/portrait.jpg";
const hasPortrait = fs.existsSync(
  path.join(process.cwd(), "public", "portrait.jpg"),
);

export function Hero() {
  return (
    <section id="top" className="pt-40 pb-20 md:pt-52 md:pb-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="relative grid items-center gap-12 md:grid-cols-[1fr_auto]">
          <QaBug />
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-faint">
              {identity.role} · {identity.location}
            </p>
            <h1 className="mt-4 text-[clamp(2.75rem,6vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-foreground">
              {identity.name}
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
              {identity.tagline}
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2" aria-label="Platforms">
              {identity.platforms.map((p) => (
                <li
                  key={p}
                  className="font-mono text-[13px] uppercase tracking-[0.15em] text-faint"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {hasPortrait && (
            <div className="relative w-fit shrink-0 rounded-full p-1.5 ring-1 ring-line">
              <Image
                src={portraitPath}
                alt={`Portrait of ${identity.name}`}
                width={568}
                height={621}
                priority
                className="h-48 w-48 rounded-full object-cover object-top grayscale md:h-64 md:w-64"
              />
            </div>
          )}
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse bg-surface px-6 py-6">
              <dt className="mt-1 text-sm text-faint">{stat.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
