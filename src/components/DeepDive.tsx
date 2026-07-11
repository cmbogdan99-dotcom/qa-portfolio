import { deepDives } from "@/content/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function DeepDive() {
  return (
    <Section
      id="deep-dive"
      label="Selected technical details"
      title="For readers who want the specifics"
    >
      <div className="space-y-4">
        {deepDives.map((item) => (
          <Reveal key={item.title}>
            <details className="deep-dive rounded-2xl border border-line bg-surface">
              <summary className="flex items-center justify-between gap-4 p-6 text-left">
                <span className="text-[17px] font-medium tracking-tight text-foreground">
                  {item.title}
                </span>
                <svg
                  className="chevron shrink-0 text-faint"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </summary>
              <div className="space-y-4 px-6 pb-6">
                {item.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-[15px] leading-relaxed text-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
