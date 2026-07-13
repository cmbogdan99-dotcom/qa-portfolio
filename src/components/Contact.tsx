"use client";

import { useState } from "react";
import { identity, links, philosophyLine } from "@/content/site";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — fallback: do nothing
    }
  };

  return (
    <>
      <Section id="contact" label="Contact" title="Get in touch">
        <Reveal>
          <p className="max-w-[60ch] leading-relaxed text-muted">
            The fastest way to reach me is email. For a full work history,
            download the CV.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={copyEmail}
              className="rounded-lg border border-line bg-surface px-5 py-2.5 font-mono text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
            >
              {copied ? "Copied!" : links.email}
            </button>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line bg-surface px-5 py-2.5 font-mono text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
            >
              LinkedIn
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line bg-surface px-5 py-2.5 font-mono text-sm text-muted transition-colors hover:border-accent/50 hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href={links.cv}
              download
              className="rounded-lg bg-accent px-5 py-2.5 font-mono text-sm font-medium text-white transition-opacity hover:opacity-85"
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
