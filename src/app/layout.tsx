import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { identity } from "@/content/site";
import { BackToTop } from "@/components/BackToTop";
import { ConsoleEgg } from "@/components/ConsoleEgg";
import { Secrets } from "@/components/Secrets";
import { LenisProvider } from "@/components/LenisProvider";
import { CommandPalette } from "@/components/CommandPalette";
import { ViewTransitions } from "@/components/ViewTransitions";
import { LightSwitch } from "@/components/LightSwitch";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = "https://bogdan-carcadea.ro";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${identity.name} · ${identity.role}`,
  description:
    "QA Automation Engineer building Playwright and TypeScript test frameworks with a Python API layer and CI/CD, backed by five years of senior QA across AAA and cross-platform software.",
  openGraph: {
    title: `${identity.name} · ${identity.role}`,
    description:
      "Test automation in Playwright, TypeScript, and Python with GitHub Actions CI, backed by five years of senior QA across console, mobile, browser, and VR.",
    url: siteUrl,
    siteName: identity.name,
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <head>
        {/* Apply saved theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LenisProvider />
        {children}
        <BackToTop />
        <CommandPalette />
        <ViewTransitions />
        <LightSwitch />
        <ConsoleEgg />
        <Secrets />
        <Analytics />
      </body>
    </html>
  );
}
