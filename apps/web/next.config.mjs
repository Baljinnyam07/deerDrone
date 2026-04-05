/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@deer-drone/types", "@deer-drone/data", "@deer-drone/utils", "@deer-drone/ui"],
};

export default nextConfig;
