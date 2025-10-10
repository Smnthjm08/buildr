/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/shared", "@repo/db"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**', // allow all paths
      },
    ],
  },
};

export default nextConfig;
