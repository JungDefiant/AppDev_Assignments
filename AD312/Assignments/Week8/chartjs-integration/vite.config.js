import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest-setup.js"],
		exclude: ["**/node_modules/**", "**/dist/**", "./temp/**", "**/public/**"],
	},
});
