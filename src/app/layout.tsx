import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { identity } from "@/content/site";
import { BackToTop } from "@/components/BackToTop";
import { ConsoleEgg } from "@/components/ConsoleEgg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://qa-portfolio-six-psi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${identity.name} — ${identity.role}`,
  description:
    "Senior QA Engineer with 5+ years shipping large cross-platform software — quality strategy, release ownership, and a growing automation practice.",
  openGraph: {
    title: `${identity.name} — ${identity.role}`,
    description:
      "Quality strategy, release ownership, and test automation across desktop, console, mobile, browser, and VR.",
    url: siteUrl,
    siteName: identity.name,
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <BackToTop />
        <ConsoleEgg />
      </body>
    </html>
  );
}
