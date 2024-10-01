/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  roots: ['<rootDir>'],
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest"
  },
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    "/node_modules/",
    "./build",
    "^(?!.*\\.spec\\.ts$)"
  ],
};