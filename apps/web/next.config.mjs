/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@deer-drone/types", "@deer-drone/data", "@deer-drone/utils", "@deer-drone/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.djicdn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
