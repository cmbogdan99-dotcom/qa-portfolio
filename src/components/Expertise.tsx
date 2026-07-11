import { expertise } from "@/content/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Expertise() {
  return (
    <Section id="expertise" label="Expertise" title="How the work breaks down">
      <div>
        {expertise.map((cat, i) => (
          <Reveal key={cat.title}>
            <article
              className={`grid gap-3 py-7 md:grid-cols-[260px_1fr] md:gap-10 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <div className="flex items-baseline gap-3">
                <p className="font-mono text-[12px] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
                  {cat.title}
                </h3>
              </div>
              <div>
                <p className="max-w-[70ch] text-[15px] leading-relaxed text-muted">
                  {cat.body}
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                  {cat.tags.map((tag) => (
                    <li key={tag} className="font-mono text-[12px] text-faint">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
