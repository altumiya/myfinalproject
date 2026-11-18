const apiUrl = process.env.NEXT_PUBLIC_APIBASEURL
  ? new URL(process.env.NEXT_PUBLIC_APIBASEURL)
  : new URL("http://localhost:8000");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.slice(0, -1),
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wscubetech.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
