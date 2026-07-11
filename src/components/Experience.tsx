import { experience, links } from "@/content/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Experience() {
  return (
    <Section id="experience" label="Experience" title="Where I've owned quality">
      <div className="grid gap-6 md:grid-cols-3">
        {experience.map((job) => (
          <Reveal key={job.company}>
            <article className="h-full rounded-2xl border border-line bg-surface p-8">
              <p className="font-mono text-[13px] text-faint">{job.period}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                {job.company}
              </h3>

              {job.roles.length > 1 ? (
                <ol className="mt-4 space-y-4 border-l border-line pl-4">
                  {job.roles.map((role, i) => (
                    <li key={role.title} className="relative">
                      <span
                        aria-hidden="true"
                        className={`absolute -left-4 top-[7px] h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
                          i === 0 ? "bg-foreground" : "bg-faint"
                        }`}
                      />
                      <p
                        className={`text-sm ${
                          i === 0 ? "font-medium text-foreground" : "text-muted"
                        }`}
                      >
                        {role.title}
                      </p>
                      <p className="font-mono text-[12px] text-faint">{role.period}</p>
                      {role.note && (
                        <p className="mt-1 text-[13px] leading-relaxed text-muted">
                          {role.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-1 text-sm text-muted">{job.roles[0].title}</p>
              )}

              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                {job.summary}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="mt-8 text-sm text-faint">
          The full role-by-role history lives in the{" "}
          <a
            href={links.cv}
            className="text-muted underline underline-offset-4 hover:text-foreground"
          >
            CV
          </a>
          . This page is about the work.
        </p>
      </Reveal>
    </Section>
  );
}
