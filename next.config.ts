import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Block MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer info sent to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable unused browser APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // CSP: allow same-origin resources, Vercel Analytics, Google Fonts
  // 'unsafe-inline' for styles is needed by Tailwind; theme-init inline script
  // is a static literal so unsafe-inline on scripts is the pragmatic trade-off
  // for a static portfolio with no user input.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://vitals.vercel-insights.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 75, 90],
  },
  async headers() {
    // CSP blocks React's eval() in dev mode — apply only in production
    const headers =
      process.env.NODE_ENV === "production"
        ? securityHeaders
        : securityHeaders.filter((h) => h.key !== "Content-Security-Policy");
    return [{ source: "/(.*)", headers }];
  },
};

export default nextConfig;
