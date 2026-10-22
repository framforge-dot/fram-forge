import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return ["/billing/:path*", "/sign-in/:path*", "/sign-up/:path*", "/offers/:path*"].map(source => ({ source, destination: "/#contact", permanent: false }));
  },
};
export default nextConfig;
