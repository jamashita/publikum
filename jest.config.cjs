module.exports = {
  verbose: true,
  bail: true,
  roots: [
    'packages'
  ],
  testRegex: '/__tests__/.+\\.spec\\.tsx?$',
  testPathIgnorePatterns: [
    'node_modules',
    'dist'
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'Mock'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@jamashita/publikum-(.*)$': '<rootDir>/packages/$1/src/index',
    '^ky$': require.resolve('ky').replace('index.js', 'umd.js'),
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx'
  ],
  testURL: 'http://localhost'
};
