import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/portfolio",
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true }
};

export default nextConfig;
