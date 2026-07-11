import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Expertise } from "@/components/Expertise";
import { DeepDive } from "@/components/DeepDive";
import { Contact } from "@/components/Contact";
import { PrintExpand } from "@/components/PrintExpand";
import { about } from "@/content/site";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <Nav />
      <PrintExpand />
      <main id="main" className="flex-1">
        <Hero />

        <Section id="about" label="About" title="How I think about quality">
          <div className="max-w-[42rem] space-y-6">
            {about.map((paragraph) => (
              <Reveal key={paragraph.slice(0, 40)}>
                <p className="leading-relaxed text-muted">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </Section>

        <Projects />
        <Experience />
        <Expertise />
        <DeepDive />
        <Contact />
      </main>
    </>
  );
}
