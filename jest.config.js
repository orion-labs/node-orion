'use strict';

module.exports = {
  collectCoverageFrom: ['**/*.js', '!**/test/**', '!coverage/**', '!*.config.js'],
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
  testEnvironment: 'node',
  testMatch: ['**/test/**/?(*.)+(spec|e2e|compliance).js'],
};
