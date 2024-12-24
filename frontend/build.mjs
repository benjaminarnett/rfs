import * as esbuild from "esbuild";

const isProduction = process.env.NODE_ENV === "production";

const config = {
  entryPoints: ["src/index.jsx"],
  bundle: true,
  jsx: "automatic",
  outdir: "public",
  define: { "process.env.NODE_ENV": isProduction ? "'production'" : "'development'" },
};

if (isProduction) {
  config.minify = true;
  config.sourcemap = true; 
  config.treeShaking = true; 
} else {
  config.minify = false;
  config.sourcemap = false;
}

try {
  let ctx = await esbuild.context(config);
  if (!isProduction) {
    await ctx.watch();
    console.log("Watching client...");
  }
  const { host, port } = await ctx.serve({
    servedir: "public",
    port: 8080,
  });
} catch (error) {
  console.error("An error occurred:", error);
  process.exit(1);
}