import * as esbuild from 'esbuild'

try {
  let ctx = await esbuild.context({
    entryPoints: ['src/index.jsx'],
    bundle: true,
    minify: false,
    sourcemap: false,
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': "'development'" },
    target: ['chrome58','firefox57','safari11','edge16'],
    outdir: 'public'
  });
  await ctx.watch();
  console.log('Watching client...');
  const { host, port } = await ctx.serve({
		servedir: 'public',
    port: 8080
	});
} catch (error) {
	console.error('An error occurred:', error);
	process.exit(1);
}