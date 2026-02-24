/** @type {import('next').NextConfig} */
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@repo/shared"],
  //output :'standalone',
  // experimental:
  // {
  //   outputFileTracingRoot: path.join(__dirname, '../../'),
  // }
};

export default nextConfig;
