import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
