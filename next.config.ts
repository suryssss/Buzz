import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",                 // ✅ use colon, not semicolon
        destination: "/conversations",
        permanent: true,             // ✅ required field
      },
    ];
  },
};

export default nextConfig;
