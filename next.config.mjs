/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Lets the service worker at /sw.js control the whole origin, not just /public.
        source: "/sw.js",
        headers: [{ key: "Service-Worker-Allowed", value: "/" }],
      },
    ];
  },
};

export default nextConfig;
