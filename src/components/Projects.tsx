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
        <p className="mt-4 text-sm">
          <a
            href="/projects"
            className="text-muted underline underline-offset-4 hover:text-foreground"
          >
            See every project I have worked on →
          </a>
        </p>
      </Reveal>
    </Section>
  );
}
