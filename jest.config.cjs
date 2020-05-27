module.exports = {
  verbose: true,
  bail: true,
  roots: [
    'packages'
  ],
  testRegex: '/__tests__/.+\\.spec\\.tsx?$',
  testPathIgnorePatterns: [
    'node_modules',
    'cjs',
    'esm'
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'Mock'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  'globals': {
    'ts-jest': {
      'tsConfig': 'tsconfig.jest.json'
    }
  },
  'moduleNameMapper': {
    '@publikum/(.*)$': '<rootDir>/packages/$1/src/index'
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx'
  ],
  testURL: 'http://localhost'
};
