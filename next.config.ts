import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
                pathname: "/api/v1/uploads/**",
            },
            {
                protocol: "https",
                hostname: "*",
               
            },
        ],
    },
};

export default nextConfig;