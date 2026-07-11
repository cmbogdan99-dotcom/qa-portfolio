import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 pt-16">
        <div className="w-full max-w-xl rounded-2xl border border-line bg-surface p-8 font-mono text-[14px] leading-relaxed md:p-10">
          <p className="text-faint">BUG-404</p>
          <h1 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
            Page not found
          </h1>
          <dl className="mt-6 space-y-2 text-muted">
            <div className="flex gap-3">
              <dt className="w-32 shrink-0 text-faint">Steps to repro</dt>
              <dd>1. Open a URL that does not exist</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 shrink-0 text-faint">Expected</dt>
              <dd>content</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 shrink-0 text-faint">Actual</dt>
              <dd>this page</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 shrink-0 text-faint">Repro rate</dt>
              <dd>100% — finally, a consistent one</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 shrink-0 text-faint">Resolution</dt>
              <dd>won&apos;t fix · by design</dd>
            </div>
          </dl>
          <p className="mt-8">
            <Link
              href="/"
              className="text-muted underline underline-offset-4 hover:text-foreground"
            >
              ← Return to a page that exists
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
