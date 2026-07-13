import Image from "next/image";
import { identity, stats, availability } from "@/content/site";
import { QaBug } from "./QaBug";
import { ThemeDot } from "./ThemeDot";
import { DefectCounter } from "./DefectCounter";
import { CountUp } from "./CountUp";
import { PortraitDrag } from "./PortraitDrag";
import fs from "node:fs";
import path from "node:path";

// Server component: portrait renders only once the file exists in /public.
const portraitPath = "/portrait.jpg";
const hasPortrait = fs.existsSync(
  path.join(process.cwd(), "public", "portrait.jpg"),
);

export function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 md:pt-52 md:pb-24">
      <div className="relative mx-auto w-full max-w-6xl px-6">
      {/* QaBug roams this content box; text and portrait sit at z-10 so
          bugs can dive under them (z-1) or walk over them (z-20). */}
      <QaBug />

        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-12">
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-faint">
                  {identity.role} <ThemeDot /> {identity.location}
                </p>
                <h1 data-secret-name className="mt-4 text-[clamp(2.5rem,6vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-foreground" style={{ whiteSpace: "nowrap" }}>
                  {identity.name}
                </h1>
                {availability.open && (
                  <div
                    className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1"
                    style={{ borderColor: "var(--avail-border)", background: "var(--avail-bg)" }}
                  >
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full"
                      style={{ background: "var(--avail-dot)" }}
                    />
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.12em]"
                      style={{ color: "var(--avail-text)" }}
                    >
                      {availability.label}
                    </span>
                  </div>
                )}
              </div>
              {hasPortrait && (
                <Image
                  src={portraitPath}
                  alt={`Portrait of ${identity.name}`}
                  width={568}
                  height={621}
                  priority
                  className="mt-1 h-16 w-16 shrink-0 rounded-full border border-line object-cover object-top grayscale md:hidden"
                />
              )}
            </div>
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
            <PortraitDrag
              src={portraitPath}
              alt={`Portrait of ${identity.name}`}
            />
          )}
        </div>

        <dl className="relative z-10 mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:mt-16 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface px-6 py-6">
              <dt className="sr-only">{stat.label}</dt>
              <dd
                id={stat.label === "defects reported" ? "defect-stat" : undefined}
                className="text-3xl font-semibold tracking-tight text-foreground"
              >
                {stat.label === "defects reported" ? (
                  <DefectCounter />
                ) : stat.value === "5+" ? (
                  <CountUp to={5} suffix="+" duration={900} />
                ) : stat.value === "7" ? (
                  <CountUp to={7} duration={700} />
                ) : stat.value === "15+" ? (
                  <CountUp to={15} suffix="+" duration={1000} />
                ) : (
                  stat.value
                )}
              </dd>
              <p aria-hidden="true" className="mt-1 text-sm text-faint">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
