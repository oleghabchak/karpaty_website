const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow dev server access from phones/devices on the local network
  allowedDevOrigins: ["192.168.*.*"],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
