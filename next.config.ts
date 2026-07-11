import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow the gallery to request higher-quality optimized images
    // (Next defaults everything to 75, which is visibly soft on photos).
    // 25 is used for the blurred letterbox backdrop behind gallery images.
    qualities: [25, 75, 90],
  },
};

export default nextConfig;
