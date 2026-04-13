/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@deer-drone/data", "@deer-drone/ui", "@deer-drone/utils", "@deer-drone/types"],
};

export default nextConfig;
