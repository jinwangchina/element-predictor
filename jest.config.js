module.exports = {
  "roots": [
    "<rootDir>/src", "<rootDir>/test"
  ],
  "transform": {
    "^.+\\.ts?$": "ts-jest"
  },
  "testRegex": "(/test/.*|(\\.|/)(test))\\.ts?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
}
