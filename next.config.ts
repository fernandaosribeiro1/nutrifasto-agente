import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/food",
        destination: "https://br.openfoodfacts.org/cgi/search.pl",
      },
    ];
  },
};

export default nextConfig;