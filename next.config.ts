import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  basePath: isProd ? "/exam-preparation" : "", // optional if using subfolder
  assetPrefix: isProd ? "/exam-preparation/" : "",
};

export default nextConfig;
