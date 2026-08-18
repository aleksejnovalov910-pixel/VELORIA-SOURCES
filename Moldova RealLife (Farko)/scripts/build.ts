import { build } from "esbuild";
import { esbuildDecorators } from "@anatine/esbuild-decorators";
import path from "node:path";

const cwd = process.cwd();
const startTime = Date.now();

build({
	platform: "node",
	target: "node14",
	bundle: true,
	plugins: [
		esbuildDecorators({
			tsconfig: path.join(cwd, "tsconfig.json"),
			cwd,
		}),
	],
	tsconfig: path.join(cwd, "tsconfig.json"),
	external: ["bson", "ffmpeg-static"],
	entryPoints: [path.join(cwd, "src", "server", "index.ts")],
	outfile: path.join(cwd, "server", "packages", "server", "index.js"),
}).then(() => {
	const endTime = Date.now();
	const buildTime = (endTime - startTime) / 1000;

	console.log(`Build Server finished in ${buildTime} seconds`);
});
