/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@deer-drone/data", "@deer-drone/ui", "@deer-drone/utils", "@deer-drone/types"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kwriuxevzrvxuwujsgmh.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    middlewareClientMaxBodySize: '50mb',
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
