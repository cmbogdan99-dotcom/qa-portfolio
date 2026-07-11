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
      {/* Keyboard-only skip link: visible only while focused via Tab,
          never after mouse clicks. */}
      <a
        href="#about"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-lg focus-visible:bg-foreground focus-visible:px-4 focus-visible:py-2 focus-visible:text-background"
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
