import Link from "next/link";
import { caseStudies, earlierWork } from "@/content/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Projects() {
  return (
    <Section id="work" label="Case studies" title="Selected work">
      <div className="space-y-6">
        {caseStudies.map((cs) => (
          <Reveal key={cs.number}>
            <article className="rounded-2xl border border-line bg-surface p-8 md:p-10">
              <div className="md:grid md:grid-cols-[auto_1fr] md:gap-10">
                <p
                  aria-hidden="true"
                  className="hidden font-mono text-4xl font-semibold text-line md:block"
                >
                  {cs.number}
                </p>
                <div>
                  <p className="font-mono text-[13px] uppercase tracking-[0.15em] text-faint">
                    {cs.context}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {cs.name}
                  </h3>

                  {cs.stats && (
                    <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
                      {cs.stats.map((stat) => (
                        <div key={stat.label} className="bg-surface px-4 py-4">
                          <dt className="sr-only">{stat.label}</dt>
                          <dd className="text-2xl font-semibold tracking-tight text-foreground">
                            {stat.value}
                          </dd>
                          <p aria-hidden="true" className="mt-1 text-[13px] text-faint">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div className="mt-6 grid gap-8 md:grid-cols-[1fr_1.4fr]">
                    <div>
                      <h4 className="font-mono text-[13px] uppercase tracking-[0.15em] text-faint">
                        The problem
                      </h4>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted">
                        {cs.challenge}
                      </p>
                      <h4 className="mt-6 font-mono text-[13px] uppercase tracking-[0.15em] text-faint">
                        Outcome
                      </h4>
                      <p className="mt-3 text-[15px] leading-relaxed text-foreground">
                        {cs.outcome}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-mono text-[13px] uppercase tracking-[0.15em] text-faint">
                        What I did
                      </h4>
                      <ul className="mt-3 space-y-3">
                        {cs.approach.map((step) => (
                          <li
                            key={step}
                            className="flex gap-3 text-[15px] leading-relaxed text-muted"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[9px] h-px w-4 shrink-0 bg-faint"
                            />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-10 text-sm leading-relaxed text-faint">{earlierWork}</p>
        <div className="mt-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-2.5 text-sm text-muted transition-colors hover:border-faint hover:text-foreground"
          >
            See every project I have worked on
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M8.5 3.5L13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
