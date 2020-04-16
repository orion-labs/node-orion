'use strict';

module.exports = {
  collectCoverageFrom: ['**/src/*.js', '!**/test/**', '!coverage/**', '!*.config.js'],
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      lines: 0,
    },
  },
  testEnvironment: 'node',
  testMatch: ['**/test/**/?(*.)+(test|spec|e2e|compliance).js'],
  verbose: true,
};
