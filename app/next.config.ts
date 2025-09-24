import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;