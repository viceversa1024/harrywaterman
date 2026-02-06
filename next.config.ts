import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/harrywaterman',
  assetPrefix: '/harrywaterman/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
