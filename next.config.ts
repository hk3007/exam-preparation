import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export", // required for static export
  basePath: isProd ? "/exam-preparation" : "", // optional if using subfolder
  assetPrefix: isProd ? "/exam-preparation/" : "",
};

export default nextConfig;
