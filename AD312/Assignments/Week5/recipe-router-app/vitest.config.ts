import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: [],
		exclude: [...configDefaults.exclude],
	},
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./app"),
		},
	},
});
