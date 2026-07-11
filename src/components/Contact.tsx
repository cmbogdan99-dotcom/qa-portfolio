import { identity, links, philosophyLine } from "@/content/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

const contactLinks = [
  { label: "Email", href: `mailto:${links.email}`, external: false },
  { label: "LinkedIn", href: links.linkedin, external: true },
  { label: "GitHub", href: links.github, external: true },
];

export function Contact() {
  return (
    <>
      <Section id="contact" label="Contact" title="Get in touch">
        <Reveal>
          <p className="max-w-[60ch] leading-relaxed text-muted">
            The fastest way to reach me is email. For a full work history,
            download the CV.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="rounded-lg border border-line bg-surface px-5 py-2.5 text-sm text-muted transition-colors hover:border-faint hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href={links.cv}
              download
              className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Download CV
            </a>
          </div>
        </Reveal>
      </Section>

      <footer className="border-t border-line py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6">
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} {identity.name}
          </p>
          <p className="font-mono text-[13px] text-faint">{philosophyLine}</p>
        </div>
      </footer>
    </>
  );
}
