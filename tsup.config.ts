import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "./src/index.ts",
  ],
  format: ["cjs", "esm"],
  platform: "node",
  target: "es2022",
  dts: true,
  bundle: true,
  clean: true,
  outExtension(ctx) {
    return {
      js: ctx.format === "cjs" ? ".cjs" : ".mjs",
    };
  },
  tsconfig: "./tsconfig.json",
});
