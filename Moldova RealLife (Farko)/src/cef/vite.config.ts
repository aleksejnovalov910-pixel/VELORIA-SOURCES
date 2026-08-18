import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { rmSync } from "fs";

export default defineConfig({
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: [".."],
		},
	},
	plugins: [
		react({
			babel: {
				plugins: [
					["@babel/plugin-proposal-decorators", { version: "legacy" }],
					["@babel/plugin-proposal-class-properties", { loose: true }],
				],
			},
			jsxRuntime: 'automatic',
			jsxImportSource: 'react'
		}),
		{
			name: "clean-cef-folder",
			buildStart() {
				const targetPath = path.resolve(
					__dirname,
					"../../server/client_packages/cef",
				);
				try {
					rmSync(targetPath, { recursive: true, force: true });
				} catch (error) {
					console.error(`Ошибка при удалении папки ${targetPath}:`, error);
				}
			},
		},
	],
	base: "./",
	build: {
		rollupOptions: {
			input: {
				cef: path.resolve(__dirname, "index.html"),
				sound: path.resolve(__dirname, "sound.html"),
			},
			output: {
				dir: "../../server/client_packages/cef",
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	optimizeDeps: {
		exclude: [],
	}	  
});
