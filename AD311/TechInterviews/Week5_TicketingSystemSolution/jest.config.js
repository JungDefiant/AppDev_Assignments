// import { createDefaultEsmPreset } from "ts-jest";

// const tsJestTransformCfg = createDefaultEsmPreset().transform;

/** @type {import("jest").Config} **/
export default {
  preset: 'ts-jest',
  testMatch: ['**/*.test.ts'],
};