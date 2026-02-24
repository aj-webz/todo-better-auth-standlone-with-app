import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm"],
  // target: "es2024",
  bundle: true,
  splitting: false,
  clean: true,
  platform: "node",
  minify: false,
  //shims: true,
  external: [
    "events",
    "fs",
    "path",
    "os",
    "crypto",
    "async_hooks",
    "http",
    "https",
    "stream",
    "url",
    "util",
  ],
  noExternal: ["@repo/shared", "@repo/db"],
});
