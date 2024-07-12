/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com"
      },
      {
        protocol: "https",
        hostname: "linkdinclonegkol.blob.core.windows.net"
      }
    ]
  }
};

export default nextConfig;
