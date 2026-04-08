import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@deer-drone/data", "@deer-drone/ui", "@deer-drone/utils", "@deer-drone/types"],
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
