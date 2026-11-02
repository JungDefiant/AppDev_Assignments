const { defineConfig } = require('jest');

module.exports = defineConfig({
  collectCoverage: true,
  collectCoverageFrom: ['main.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 80,
      functions: 80,
      lines: 90,
    },
  },
});
