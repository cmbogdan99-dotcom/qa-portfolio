import React from "react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { ScrambleLabel } from "./ScrambleLabel";

type SectionProps = {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, label, title, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-16 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
            <ScrambleLabel text={label} />
          </p>
          <h2
            id={`${id}-title`}
            className="mt-3 font-display text-[30px] font-medium tracking-[-0.02em] text-foreground"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {title}
          </h2>
        </Reveal>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
